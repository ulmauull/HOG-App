using System.Net.Http.Json;
using System.Text.Json;
using HogAgent.Models;
using Microsoft.Extensions.Logging;

namespace HogAgent.Services;

public class HogApiClient
{
    private readonly HttpClient _httpClient;
    private readonly AgentConfig _config;
    private readonly ILogger<HogApiClient> _logger;

    public HogApiClient(HttpClient httpClient, AgentConfig config, ILogger<HogApiClient> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;

        _httpClient.BaseAddress = new Uri(_config.BackendUrl.TrimEnd('/') + "/");
        _httpClient.Timeout = TimeSpan.FromSeconds(10);
        _httpClient.DefaultRequestHeaders.Add("X-PC-Code", _config.PcCode);
        _httpClient.DefaultRequestHeaders.Add("X-Agent-Key", _config.ApiKey);
    }

    public async Task<AuthResponse?> AuthenticateAsync(CancellationToken ct = default)
    {
        try
        {
            var payload = new
            {
                pc_code = _config.PcCode,
                api_key = _config.ApiKey,
                agent_version = _config.AgentVersion
            };

            var res = await _httpClient.PostAsJsonAsync("api/v1/agent/auth.php", payload, ct);
            if (res.IsSuccessStatusCode)
            {
                return await res.Content.ReadFromJsonAsync<AuthResponse>(cancellationToken: ct);
            }

            var errText = await res.Content.ReadAsStringAsync(ct);
            _logger.LogWarning("Authentication returned non-success: {StatusCode} - {Body}", res.StatusCode, errText);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to connect to backend for authentication.");
            return null;
        }
    }

    public async Task<HeartbeatResponse?> SendHeartbeatAsync(HeartbeatPayload payload, CancellationToken ct = default)
    {
        try
        {
            var res = await _httpClient.PostAsJsonAsync("api/v1/agent/heartbeat.php", payload, ct);
            if (res.IsSuccessStatusCode)
            {
                return await res.Content.ReadFromJsonAsync<HeartbeatResponse>(cancellationToken: ct);
            }

            _logger.LogWarning("Heartbeat response code: {StatusCode}", res.StatusCode);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Heartbeat transmission error: {Message}", ex.Message);
            return null;
        }
    }

    public async Task<SessionActionResponse?> RequestSessionStartupAsync(int? durationMinutes = null, CancellationToken ct = default)
    {
        try
        {
            var payload = new
            {
                duration_minutes = durationMinutes ?? _config.DefaultDurationMinutes
            };

            var res = await _httpClient.PostAsJsonAsync("api/v1/agent/session.php", payload, ct);
            if (res.IsSuccessStatusCode)
            {
                return await res.Content.ReadFromJsonAsync<SessionActionResponse>(cancellationToken: ct);
            }

            var err = await res.Content.ReadAsStringAsync(ct);
            _logger.LogError("Session startup error: {Status} - {Error}", res.StatusCode, err);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to request session startup from backend.");
            return null;
        }
    }

    public async Task<SessionActionResponse?> ReconcileStateAsync(int? localSessionId, CancellationToken ct = default)
    {
        try
        {
            var payload = new { session_id = localSessionId };
            var res = await _httpClient.PostAsJsonAsync("api/v1/agent/reconcile.php", payload, ct);
            if (res.IsSuccessStatusCode)
            {
                return await res.Content.ReadFromJsonAsync<SessionActionResponse>(cancellationToken: ct);
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Reconciliation communication error: {Message}", ex.Message);
            return null;
        }
    }
}

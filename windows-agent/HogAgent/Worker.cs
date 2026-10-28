using System.Diagnostics;
using HogAgent.Models;
using HogAgent.Services;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HogAgent;

public class Worker : BackgroundService
{
    private readonly HogApiClient _apiClient;
    private readonly SessionCountdownService _countdownService;
    private readonly AgentConfig _config;
    private readonly ILogger<Worker> _logger;
    private readonly Stopwatch _systemUptime = Stopwatch.StartNew();

    public Worker(
        HogApiClient apiClient,
        SessionCountdownService countdownService,
        AgentConfig config,
        ILogger<Worker> logger)
    {
        _apiClient = apiClient;
        _countdownService = countdownService;
        _config = config;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("=================================================================");
        _logger.LogInformation(" HOME OF GAMERS (HOG) — WINDOWS SESSION AGENT v{Version}", _config.AgentVersion);
        _logger.LogInformation(" Registered PC: {PcCode} | Room: Auto-Mapped | Backend: {Backend}", _config.PcCode, _config.BackendUrl);
        _logger.LogInformation(" NOTE: Operating independently from Cyberindo Billing.");
        _logger.LogInformation("=================================================================");

        // Step 1: Initial Authentication & Startup Session Logic
        await InitializeStartupSessionAsync(stoppingToken);

        // Timers: 1-second countdown tick and Heartbeat interval
        var lastHeartbeatTime = DateTime.MinValue;
        var heartbeatInterval = TimeSpan.FromSeconds(Math.Max(5, _config.HeartbeatIntervalSeconds));

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // 1. Tick local countdown clock
                _countdownService.Tick();

                // 2. Check if heartbeat is due
                if (DateTime.UtcNow - lastHeartbeatTime >= heartbeatInterval)
                {
                    await PerformHeartbeatCycleAsync(stoppingToken);
                    lastHeartbeatTime = DateTime.UtcNow;
                }

                await Task.Delay(1000, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in agent main loop.");
                await Task.Delay(2000, stoppingToken);
            }
        }

        _logger.LogInformation("HOG Windows Agent service is shutting down.");
    }

    private async Task InitializeStartupSessionAsync(CancellationToken ct)
    {
        _logger.LogInformation("[STARTUP] Authenticating {PcCode} with HOG backend...", _config.PcCode);

        AuthResponse? auth = null;
        int retries = 0;

        // Keep attempting startup auth with exponential backoff if backend is still starting up
        while (!ct.IsCancellationRequested && auth == null && retries < 10)
        {
            auth = await _apiClient.AuthenticateAsync(ct);
            if (auth == null)
            {
                retries++;
                int delaySec = Math.Min(30, (int)Math.Pow(2, Math.Min(retries, 5)));
                _logger.LogWarning("[STARTUP] Backend not reachable. Retrying in {Sec}s (Attempt #{Attempt})...", delaySec, retries);
                await Task.Delay(TimeSpan.FromSeconds(delaySec), ct);
            }
        }

        if (auth == null)
        {
            _logger.LogError("[STARTUP] Could not authenticate with backend after retries. Entering offline retry loop.");
            return;
        }

        _logger.LogInformation("[STARTUP] Authentication successful! Message: {Msg}", auth.Message);

        // RESTART RECOVERY RULE:
        // If an active session exists on the backend, RESUME displaying its remaining time!
        if (auth.HasActiveSession && auth.Session != null)
        {
            _logger.LogInformation(
                "[RECOVERY] Active session #{Id} detected on backend. Preserving session and resuming countdown.",
                auth.Session.Id
            );
            _countdownService.UpdateAuthoritativeSession(auth.Session, auth.Session.RemainingSeconds);
        }
        else if (_config.AutoStartSessionOnBoot)
        {
            // If no active session exists and startup policy allows: request new session
            _logger.LogInformation("[STARTUP] No active session found. Requesting new session ({Duration}m)...", _config.DefaultDurationMinutes);
            var actionRes = await _apiClient.RequestSessionStartupAsync(_config.DefaultDurationMinutes, ct);
            if (actionRes != null && actionRes.Session != null)
            {
                _logger.LogInformation("[STARTUP] Session #{Id} initiated successfully.", actionRes.Session.Id);
                _countdownService.UpdateAuthoritativeSession(actionRes.Session, actionRes.Session.RemainingSeconds);
            }
        }
        else
        {
            _logger.LogInformation("[STARTUP] PC is idle and waiting for manual/booking session start.");
        }
    }

    private async Task PerformHeartbeatCycleAsync(CancellationToken ct)
    {
        var currentSess = _countdownService.CurrentSession;
        var process = Process.GetCurrentProcess();

        var payload = new HeartbeatPayload
        {
            SessionId = currentSess?.Id,
            AgentVersion = _config.AgentVersion,
            ClientTimestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
            RamUsageMb = (int)(process.WorkingSet64 / (1024 * 1024)),
            CpuLoad = null,
            HealthStatus = "ok",
            SystemUptimeSeconds = (long)_systemUptime.Elapsed.TotalSeconds
        };

        var ack = await _apiClient.SendHeartbeatAsync(payload, ct);
        if (ack != null && ack.Success)
        {
            // Recalibrate authoritative countdown with backend
            if (ack.HasActiveSession && ack.Session != null)
            {
                _countdownService.UpdateAuthoritativeSession(ack.Session, ack.RemainingSeconds);
            }
            else if (!ack.HasActiveSession && currentSess != null)
            {
                // Session was ended by operator or expired on backend
                _logger.LogInformation("[SYNC] Active session was ended or expired on backend.");
                _countdownService.UpdateAuthoritativeSession(null, 0);
            }
        }
    }
}

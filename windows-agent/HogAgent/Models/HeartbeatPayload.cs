using System.Text.Json.Serialization;

namespace HogAgent.Models;

public class HeartbeatPayload
{
    [JsonPropertyName("session_id")]
    public int? SessionId { get; set; }

    [JsonPropertyName("agent_version")]
    public string AgentVersion { get; set; } = "1.0.0";

    [JsonPropertyName("client_timestamp")]
    public string ClientTimestamp { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

    [JsonPropertyName("cpu_load")]
    public double? CpuLoad { get; set; }

    [JsonPropertyName("ram_usage_mb")]
    public int? RamUsageMb { get; set; }

    [JsonPropertyName("ping_ms")]
    public int? PingMs { get; set; }

    [JsonPropertyName("health_status")]
    public string HealthStatus { get; set; } = "ok";

    [JsonPropertyName("system_uptime_seconds")]
    public long SystemUptimeSeconds { get; set; }
}

public class HeartbeatResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("ack")]
    public bool Ack { get; set; }

    [JsonPropertyName("has_active_session")]
    public bool HasActiveSession { get; set; }

    [JsonPropertyName("session")]
    public SessionData? Session { get; set; }

    [JsonPropertyName("server_time")]
    public string ServerTime { get; set; } = "";

    [JsonPropertyName("remaining_seconds")]
    public int RemainingSeconds { get; set; }
}

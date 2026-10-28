using System.Text.Json.Serialization;

namespace HogAgent.Models;

public class SessionData
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("session_code")]
    public string SessionCode { get; set; } = "";

    [JsonPropertyName("pc_id")]
    public int PcId { get; set; }

    [JsonPropertyName("pc_code")]
    public string PcCode { get; set; } = "";

    [JsonPropertyName("room_type")]
    public string RoomType { get; set; } = "";

    [JsonPropertyName("start_time")]
    public string StartTime { get; set; } = "";

    [JsonPropertyName("scheduled_end_time")]
    public string ScheduledEndTime { get; set; } = "";

    [JsonPropertyName("actual_end_time")]
    public string? ActualEndTime { get; set; }

    [JsonPropertyName("duration_minutes")]
    public int DurationMinutes { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "active";

    [JsonPropertyName("start_type")]
    public string StartType { get; set; } = "agent_startup";

    [JsonPropertyName("remaining_seconds")]
    public int RemainingSeconds { get; set; }
}

public class AuthResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = "";

    [JsonPropertyName("has_active_session")]
    public bool HasActiveSession { get; set; }

    [JsonPropertyName("session")]
    public SessionData? Session { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public class SessionActionResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("resumed")]
    public bool Resumed { get; set; }

    [JsonPropertyName("is_new")]
    public bool IsNew { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = "";

    [JsonPropertyName("session")]
    public SessionData? Session { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

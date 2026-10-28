namespace HogAgent.Models;

public class AgentConfig
{
    public string BackendUrl { get; set; } = "http://localhost/backend";
    public string PcCode { get; set; } = "PC-01";
    public string ApiKey { get; set; } = "HOG_SECRET_AGENT_KEY_PC01_2025";
    public int HeartbeatIntervalSeconds { get; set; } = 15;
    public bool AutoStartSessionOnBoot { get; set; } = true;
    public int DefaultDurationMinutes { get; set; } = 120;
    public string AgentVersion { get; set; } = "1.0.0";
}

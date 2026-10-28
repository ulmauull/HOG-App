using HogAgent.Models;
using Microsoft.Extensions.Logging;

namespace HogAgent.Services;

public class SessionCountdownService
{
    private readonly ILogger<SessionCountdownService> _logger;
    private SessionData? _currentSession;
    private int _remainingSeconds;
    private readonly object _lock = new();

    public event Action<SessionData?, int>? OnTick;
    public event Action<SessionData>? OnSessionExpired;

    public SessionCountdownService(ILogger<SessionCountdownService> logger)
    {
        _logger = logger;
    }

    public SessionData? CurrentSession
    {
        get { lock (_lock) return _currentSession; }
    }

    public int RemainingSeconds
    {
        get { lock (_lock) return _remainingSeconds; }
    }

    public void UpdateAuthoritativeSession(SessionData? session, int serverRemainingSeconds)
    {
        lock (_lock)
        {
            _currentSession = session;
            _remainingSeconds = Math.Max(0, serverRemainingSeconds);
        }

        if (session != null)
        {
            var span = TimeSpan.FromSeconds(_remainingSeconds);
            _logger.LogInformation(
                "[SYNC] Authoritative Session #{Id} | Remaining: {Hours:D2}:{Minutes:D2}:{Seconds:D2} | Scheduled End: {End}",
                session.Id, (int)span.TotalHours, span.Minutes, span.Seconds, session.ScheduledEndTime
            );
        }
    }

    public void Tick()
    {
        SessionData? expiredSession = null;

        lock (_lock)
        {
            if (_currentSession != null && _remainingSeconds > 0)
            {
                _remainingSeconds--;
                if (_remainingSeconds <= 0)
                {
                    expiredSession = _currentSession;
                    _currentSession = null;
                }
            }
        }

        OnTick?.Invoke(CurrentSession, RemainingSeconds);

        if (expiredSession != null)
        {
            _logger.LogWarning("[EXPIRED] Session #{Id} reached 0 seconds. Rig is now eligible for next session according to policy.", expiredSession.Id);
            OnSessionExpired?.Invoke(expiredSession);
        }
    }
}

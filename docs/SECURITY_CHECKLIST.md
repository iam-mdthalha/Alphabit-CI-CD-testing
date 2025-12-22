# 🔒 Security Checklist

## Server Hardening

- [ ] SSH key-only authentication enabled
- [ ] Root login disabled
- [ ] SSH port changed (optional)
- [ ] Firewall (UFW) configured and active
- [ ] Fail2Ban installed and configured
- [ ] Automatic security updates enabled
- [ ] Kernel hardening applied (sysctl)
- [ ] Audit logging enabled (auditd)
- [ ] Unnecessary services disabled

## Application Security

- [ ] HTTPS enforced (SSL/TLS)
- [ ] Security headers configured (Nginx)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

## Container Security

- [ ] Non-root user in Dockerfile
- [ ] Minimal base images used
- [ ] No secrets in images
- [ ] Image vulnerability scanning
- [ ] Resource limits configured

## CI/CD Security

- [ ] Secrets stored in GitHub Secrets
- [ ] Dependency vulnerability scanning
- [ ] Code security scanning (SAST)
- [ ] Secret scanning enabled
- [ ] Branch protection rules

## Monitoring & Incident Response

- [ ] Logging configured
- [ ] Log rotation enabled
- [ ] Alerting configured
- [ ] Incident response plan documented
- [ ] Backup strategy implemented

## Regular Audits

- [ ] Weekly: Run security-audit. sh
- [ ] Monthly: Review access logs
- [ ] Quarterly: Full penetration test
- [ ] Annually: Security policy review

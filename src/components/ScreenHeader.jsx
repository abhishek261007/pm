const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
  },
  title: {
    fontSize: 24,
    fontWeight: 200,
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
  },
};

export function ScreenHeader({ title, subtitle, rightElement }) {
  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

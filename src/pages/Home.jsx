import './Home.css';
import TabBar from '../components/TabBar';

export default function Home() {
  return (
    <div className="home-root">
      <div className="center-body">
        <div className="construction-icon">⚒</div>
        <h1 className="construction-title">Under Construction</h1>
        <p className="construction-sub">
          We're working on something beautiful. Check back soon.
        </p>
      </div>
      <TabBar />
    </div>
  );
}

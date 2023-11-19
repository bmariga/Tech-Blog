// import alxLogo from "./images/alx-logo.png";
import "./App.css";

function App() {
  return (
    <main>
      <header>
        <a href="#" className="logo">
          {" "}
          ALXTech
        </a>
        <nav>
          <a href="">Register</a>
          <a href="">Login</a>
        </nav>
      </header>
      <div className="post">
        <div className="image">
          <img
            src="https://techcrunch.com/wp-content/uploads/2022/12/lawnmower-Large.jpeg?w=1390&crop=1"
            alt=""
          />
        </div>
        <div className="texts">
          <h2>
            EcoFlow teases full-house battery backup coming later this year.
          </h2>
          <p className="info">
            <a href="" className="author">
              Mariga Nyaribo
            </a>
            <time>2023-11-20 10:25</time>
          </p>
          <p className="content">
            Today at its special launch event, home backup power giant EcoFlow
            launched a flurry of new products, including a “Whole-Home Backup
            Power Solution.
          </p>
        </div>
      </div>
      <div className="post">
        <div className="image">
          <img
            src="https://techcrunch.com/wp-content/uploads/2022/12/lawnmower-Large.jpeg?w=1390&crop=1"
            alt=""
          />
        </div>
        <div className="texts">
          <h2>
            EcoFlow teases full-house battery backup coming later this year.
          </h2>
          <p className="info">
            <a href="" className="author">
              Mariga Nyaribo
            </a>
            <time>2023-11-20 10:25</time>
          </p>
          <p className="content">
            Today at its special launch event, home backup power giant EcoFlow
            launched a flurry of new products, including a “Whole-Home Backup
            Power Solution.
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;

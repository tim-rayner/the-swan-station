export default function Computer({ children }: { children: React.ReactNode }) {
  return (
    <div className="computer">
      <div className="computer-inner">
        <div className="screen">{children}</div>
        <div className="side-pane">
          <div className="stats">
            <div>
              <p>Last Reset By:</p>
              <strong className="last-reset-by">
                <a href="#">Tim</a>
              </strong>
            </div>
            <div>
              <p>
                Current Resets: <b>2837</b>
              </p>
              <p>
                Running: <b>754d 8h</b>
              </p>
            </div>
            <div>
              <p>
                Most Resets: <b>3654</b>
              </p>
              <p>
                Ran for: <b>1023d 4h</b>
              </p>
            </div>
            <div>
              <p>
                Online: <b>3</b>
              </p>
              <p>
                Most Online: <b>3</b>
              </p>
            </div>
          </div>
          <div className="dharma-badge">
            <img src="https://logoeps.com/wp-content/uploads/2013/01/dharma-initiative-logo-vector.png" />
            <div className="bars">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
          <div className="controls">
            <div
              className="sound-toggle"
              role="button"
              title="click to turn on"
            >
              <span>sound</span> OFF
              <span className="toggle-text">turn on</span>
            </div>
            <div>
              <span className="indicator"></span>
              <span className="control-switch"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

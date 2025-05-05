

const LogIn = () => {
  return (
    <section>
        <div className="container">
          <div className="content">
              <div className="uptext">
                  <h3>Welcome back</h3>
                  <input type="text" placeholder="Email address" />
              </div>

              <div className="bottom">
                <button className="bnt"><a href="#">Continue</a></button>
                <p>Don't have an account? <span>Sign up</span></p>
                <div className="div">
                  <div className="div"></div>
                </div>
              </div>
          </div>
        </div>
    </section>
  )
}

export default LogIn

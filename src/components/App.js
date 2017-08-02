import React, { Component } from 'react'

// for now we don't really have much app-level behavior defined, but these things could be error messages,
// tutorial presentation, and anything else that could be visible regardless of what screen we are on

class App extends Component {
  state = {}

  componentWillMount() {}

  render() {
    const {children} = this.props
    return (
      <div>
          {children}
      </div>
    )
  }
}

export default App

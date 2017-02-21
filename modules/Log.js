import React from 'react'
import axios from 'axios';
import { Link } from 'react-router'


export default React.createClass({
  getInitialState: function() {
    return {
      container: "",
      log: "",
      name: "",
      containers: []
    }
  },


  componentWillReceiveProps: function (nextProps) {
    // Only load if params have changed
    if (nextProps.params.namespace != this.props.params.namespace ||
        nextProps.location.query.container != this.state.container ||
        nextProps.params.name != this.state.name) {
      const namespace = nextProps.params.namespace;
      const podName = nextProps.params.name;
      const container = nextProps.location.query.container;
      this.loadDocument(namespace, podName, container);
    }
  },


  loadDocument: function(namespace, podName, container) {
    const url = '/api/v1/namespaces/' + namespace + '/pods/' + podName + '/log?container=' + container;
    const _this = this;
    axios.get(url)
      .then(res => {
        var log = res.data;
        if (log == "") {
          log = "(empty)";
        }
        _this.setState({ container: container, log: log, name: podName });
      });
  },


  componentDidMount: function() {
    const namespace = this.props.params.namespace;
    const podName = this.props.params.name;
    const container = this.props.location.query.container;
    this.loadDocument(namespace, podName, container);
  },


  render() {
    return (
      <div>
        <h1>Log for Pod: {this.state.name}</h1>
        {this.state.container &&
          <h2>Container: {this.state.container}</h2>
        }

        {this.state.containers.length > 0 &&
          <div className="bg-warning">
            <b>This pod has the following containers.  Select one to view the logs.</b>
            <ul>
            {this.state.containers.map( container =>
              <li key={container}>
                <Link to={"/namespaces/"+ this.props.params.namespace +"/pods/" + this.state.name + "/log?container=" + container}>{ container }</Link>
              </li>
            )}
            </ul>
          </div>
        }

        <div>
          <Link to={"/namespaces/"+ this.props.params.namespace +"/events"}>Events</Link> <span className="divider">|</span>
          <Link to={"/namespaces/"+ this.props.params.namespace +"/pods"}>Pods</Link> <span className="divider">|</span>
          <Link to={"/namespaces/"+ this.props.params.namespace +"/services"}>Services</Link>
        </div>
        <div className="col-md-12 code log">
          {this.state.log}
        </div>
      </div>
    )
  }
})
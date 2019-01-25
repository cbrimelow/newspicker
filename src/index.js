import React from 'react'
import ReactDOM from 'react-dom'

const NEWSAPIURL = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=';
const NEWSAPIKEY = '18a2cbdecf3c431faa01de0278ef6e86';

class NewsAPI extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        articles: [],
      };
    }
  
    componentDidMount() {
      fetch(NEWSAPIURL + NEWSAPIKEY)
        .then(response => response.json())
        .then(data => this.setState({ articles: data.articles }));
    }
  
    render() {
      const { articles } = this.state;
  
      return (
        <div class="row">
          {articles.map(article =>
            <div class="col-md-4" key={article.publishedAt}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <p><a class="btn btn-default" href={article.url} target="_blank" role="button">Read Story »</a></p>
            </div>
          )}
        </div>
      );
    }
  
  }

  class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }



ReactDOM.render(
    <NewsAPI />,
    document.getElementById('root')
)

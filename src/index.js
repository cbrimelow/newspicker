import React from 'react'
import ReactDOM from 'react-dom'

const NEWSAPIURL = 'https://newsapi.org/v2/everything';
const NEWSAPIKEY = '18a2cbdecf3c431faa01de0278ef6e86';

class SearchType extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: 'arizona'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
  
    render() {
        return (
            <form className="form-inline" onSubmit={this.handleSubmit}>
                <div className="form-group mx-sm-3 mb-2">
                <input className="form-control" type="text" placeholder="Enter Search Term" onChange={this.handleChange} />
                &nbsp;<input className="btn btn-primary mb-2" type="submit" value="Submit" />
                </div> 
                <h3 className="text-info">Showing articles related to "{this.state.value}."</h3>
                <NewsAPI searchTerm={this.state.value} />
            </form>
        );
    }
}

class NewsAPI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {articles: []};
    }
  
    componentDidMount() {
        var fullURL = `${NEWSAPIURL}?q=${this.props.searchTerm}&apiKey=${NEWSAPIKEY}`;
        console.log(fullURL);
        fetch(fullURL)
            .then(response => response.json())
            .then(data => this.setState({articles: data.articles}));
    }
  
    render() {
      const {articles} = this.state; 
      return (
        <div className="row">
            {articles.map((article, index) =>
                <article className="col-md-4" key={index}>
                    <div className="articleImage">
                        <img src={article.urlToImage} alt="" />
                    </div>
                    <h3 className="text-info">{article.title}</h3>
                    <p>{article.description}</p>
                    <p><a className="btn btn-info" href={article.url} target="_blank" role="button">Read Story »</a></p>
                </article>
            )}
        </div>
      );
    }
  
}

ReactDOM.render(
    <SearchType />,
    document.getElementById('root')
)

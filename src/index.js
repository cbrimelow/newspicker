import React from 'react'
import ReactDOM from 'react-dom'

  const NewsForm = (props) => {
      return (
        <div className="form-group mx-sm-3 mb-2">
            <div id="searchForm" className="form-inline">
              <input className="form-control" placeholder="Enter Search Term" onChange={props.updateTerm} />
              &nbsp;<input className="btn btn-primary mb-2" type="submit" value="Submit" onClick={props.getStories} />
            </div>
            <h3 className="text-info">{props.searchText}</h3>
        </div>      
      )
  }

class NewsAPI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searchPage: 1,
            articles: []
        };
        this.searchText= '';
    }
    
    updateTerm = (e) => {
        this.setState({ searchTerm: e.target.value });
    }
    
    loadMore = () => {
        let newPage = this.state.searchPage + 1;
        this.setState({ searchPage: newPage });
        this.getStories();
    }
    
    getStories = (e) => {
        
        //alert(this.state.searchTerm);

        const NEWSAPIKEY = '18a2cbdecf3c431faa01de0278ef6e86';
        const NEWSAPIURL = `https://newsapi.org/v2/everything?q=${this.state.searchTerm}&pageSize=10&page=${this.state.searchPage}&apiKey=${NEWSAPIKEY}`;
        
        this.searchText = `Showing articles related to "${this.state.searchTerm}."`;
        
        console.log(NEWSAPIURL);
        
        fetch(NEWSAPIURL)
        .then(r => r.json())
        .then(data => this.setState({ searchTerm: '', 
            articles: data.articles 
        }))
        .catch(e => this.searchText = `Error: ${e}`);
    }
    
    render() {
        const {articles} = this.state;
        return (
            <div id="main">
                <NewsForm getStories={this.getStories} updateTerm={this.updateTerm} searchText={this.searchText} />
                <div className="row">
                    {articles.map((article, index) =>
                        <article className="col-xs-12" key={index}>
                            <div className="col-xs-12 col-sm-3 articleImage">
                                <a href={article.url} rel="noopener noreferrer" target="_blank"><img src={article.urlToImage} alt="" /></a>
                            </div>
                            <div className="col-xs-12 col-sm-9">
                            <h4 className="text-info"><a href={article.url} rel="noopener noreferrer" target="_blank">{article.title}</a></h4>
                            <p><em>{article.author}</em></p>
                            <p>{article.description}</p> 
                            <a className="text-info" href={article.url} rel="noopener noreferrer" target="_blank">&raquo; Read More</a>
                            </div>
                        </article>
                    )}
                </div>
                <div className="row">
                    <div className="col-xs-12" id="loadmore" onClick={this.loadMore}>Load More Stories</div>
                </div>    
            </div>
        );
    } 
  
}

ReactDOM.render(
    <NewsAPI />,
    document.getElementById('root')
)

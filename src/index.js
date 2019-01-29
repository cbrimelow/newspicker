import React from 'react'
import ReactDOM from 'react-dom'

const NewsForm = (props) => {
    return (
        <div className="form-group mx-sm-3 mb-2">
            <div id="searchForm" className="form-inline">
                <input onChange={props.updateTerm} className="form-control" placeholder="Enter Search Term" />&nbsp;
                <input onClick={props.getStories} className="btn btn-primary mb-2" type="submit" value="Submit" />
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
            searchTermChanged: false,
            searchPage: 1,
            searchText: '',
            articles: []
        };
    }
    
    updateTerm = (e) => {
        this.setState({ searchTerm: e.target.value, searchPage: 1, searchTermChanged: true });
    }
    
    getStories = () => {
        
        const NEWSAPIKEY = '18a2cbdecf3c431faa01de0278ef6e86';
        const NEWSAPIURL = `https://newsapi.org/v2/everything?q=${this.state.searchTerm}&pageSize=10&page=${this.state.searchPage}&apiKey=${NEWSAPIKEY}`;
        
        fetch(NEWSAPIURL)
        .then(r => r.json())
        .then(data => {  

            if (this.state.searchTermChanged) {
                this.setState({articles: []});
            }

            let newArticleList = [];
            let existingArticles = this.state.articles;
            let newArticles = data.articles;
            
            if (!Array.isArray(existingArticles) || !existingArticles.length) {
                newArticleList = newArticles;
            } else {
                newArticleList.concat(existingArticles);
                newArticleList.concat(newArticles);
            }

            console.log('New data: ' + NEWSAPIURL);

            return (
                this.setState({ 
                    searchText: `Showing articles related to "${this.state.searchTerm}."`,
                    articles: newArticleList 
                })
            )
        })
        .catch(e => this.setState({searchText: `Error: ${e}`}));
    }
   
    loadMore = () => {
        let newPage = this.state.searchPage;
        newPage = newPage + 1;
        this.setState({ searchPage: newPage });
        console.log('New page: ' + this.state.searchPage);
        this.getStories();
    }
    
    render() {
        const {articles} = this.state;
        return (
            <div id="main">
                <NewsForm getStories={this.getStories} updateTerm={this.updateTerm} searchText={this.state.searchText} />
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

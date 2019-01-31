import React from 'react'
import ReactDOM from 'react-dom'

const NewsForm = (props) => {
    
    return (
        <div className="form-group mx-sm-3 mb-2">
            <div id="searchForm" className="form-inline">
                <input onChange={props.updateTerm} className="form-control" placeholder="Enter Search Term" />
                <input onClick={props.getStories} className="submitButton" type="submit" value="Submit" />
            </div>
            <h4 className="searchText">{props.searchText}</h4>
        </div>      
    )
    
}

const LoadMoreButton = (props) => {
    
    if (props.articles.length) {
        //If articles, show button
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div id="loadmore" onClick={props.loadMore}>Load More Stories</div>
                </div>
            </div>         
        )
        
    } else {
        //If no articles, don't show button
        return null;
        
    }
}

const ArticleMarkup = (props) => {

    const theArticles = props.articles;
    /*
    const theMarkup = theArticles.map((article, index) => (
        <div key={index}>
            <h1>{article.publishedAt}</h1>
        </div>
        )
    );
    */
    return (
        <div className="row">
            {theArticles.map((article, index) =>
                <article className="col-xs-12 col-md-6" key={index}>
                    <div className="col-xs-12 col-sm-4 articleImage">
                        
                    {article.urlToImage ?
                        <a href={article.url} rel="noopener noreferrer" target="_blank"><img src={article.urlToImage} alt="" /></a>
                        :
                        <div className="noPhoto">No Photo Available</div>
                    }
                    </div>
                    <div className="col-xs-12 col-sm-8">
                    <h3><a href={article.url} rel="noopener noreferrer" target="_blank">{article.title}</a></h3>
                    <p><em>{article.author}</em></p>
                    <p>{article.publishedAt}</p>
                    <p>{article.description}</p> 
                    <a className="readMore" href={article.url} rel="noopener noreferrer" target="_blank">&raquo; Read More</a>
                    </div>
                </article>
            )}
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
        
        let searchTermChanged = false;
        
        if (this.state.searchText !== '') {
            searchTermChanged = true;
        }
        
        this.setState({ searchTerm: e.target.value, searchPage: 1, searchTermChanged: searchTermChanged });
        
    }
    
    getStories = () => {
        
        const NEWSAPIKEY = '18a2cbdecf3c431faa01de0278ef6e86';
        const NEWSAPIURL = `https://newsapi.org/v2/everything?q=${this.state.searchTerm}&pageSize=10&page=${this.state.searchPage}&apiKey=${NEWSAPIKEY}`;
        const OLDARTICLES = this.state.articles;

        console.log(NEWSAPIURL);
                
        fetch(NEWSAPIURL)
        .then(r => r.json())
        
        .then(data => {  

            let newArticleList = []; 
            let totalArticles = data.totalResults;         
            let newArticles = data.articles;
            
            if (!OLDARTICLES.length || this.state.searchTermChanged) { 
                //if first fetch or if new search term
                newArticleList = newArticles;
            } else { 
                //if there are already articles, add new ones
                newArticleList = OLDARTICLES.concat(newArticles);
            }

            return (
                this.setState({ 
                    searchText: `Showing articles related to "${this.state.searchTerm}." Total Results: ${totalArticles}`,
                    articles: newArticleList 
                })
            )
            
        })
        
        .catch(e => this.setState({searchText: `Error: ${e}`}));
    }
   
    loadMore = () => {
        
        let currPage = this.state.searchPage;
        let newPage = currPage + 1;
        
        this.setState({searchPage: newPage, searchTermChanged: false}, () => {
            this.getStories();
        });
        
    }
    
    render() {
        
        return (
            <div id="main">
                <NewsForm getStories={this.getStories} updateTerm={this.updateTerm} searchText={this.state.searchText} />
                <ArticleMarkup articles={this.state.articles} />
                <LoadMoreButton loadMore={this.loadMore} articles={this.state.articles} />
            </div>
        );

    } 
  
}

ReactDOM.render(
    <NewsAPI />,
    document.getElementById('root')
)

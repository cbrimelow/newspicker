import React from 'react'
import ReactDOM from 'react-dom'

const NewsForm = (props) => {
    
    return (
        <div className="form-group mx-sm-3 mb-2">
            <div id="searchForm" className="form-inline">
                <input onChange={props.updateTerm} className="form-control" placeholder="Enter Search Term" />
                <input onClick={props.checkTerm} className="submitButton" type="submit" value="Submit" />           
                <label>Sort By:</label>
                <select onChange={props.changeSort} id="sortBy">
                    <option value="publishedAt">Published Date</option>
                    <option value="relevancy">Relevancy</option>
                    <option value="popularity">Popularity</option>
                </select>
            </div>
            <h4 className="searchText">{props.searchText}</h4>
        </div>      
    )
    
}

const LoadMoreButton = (props) => {
    
    if (props.articles.length && !props.lastPage) {
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

const convertTime = (time) => {
    let theNewTime = (new Date(time)).toDateString();
    return theNewTime;
}

const convertNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ArticleMarkup = (props) => {

    const theArticles = props.articles;

    return (
        <div className="row">
            {theArticles.map((article, index) =>
                <article className="col-xs-12" key={index}>
                    <div className="col-xs-12 col-sm-4 articleImage">                       
                        {article.urlToImage ?
                            <a href={article.url} rel="noopener noreferrer" target="_blank"><img src={article.urlToImage} alt="" /></a>
                            :
                            <div className="noPhoto">No Photo Available</div>
                        }
                        </div>
                        <div className="col-xs-12 col-sm-8">
                        <h3><a href={article.url} rel="noopener noreferrer" target="_blank">{article.title}</a></h3>
                        <p>{article.source.name} <em>{article.author}</em></p>
                        <p>{convertTime(article.publishedAt)}</p>
                        <p className="articleDesc">{article.description}</p> 
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
            lastPage: false,
            searchText: '',
            sortBy: 'publishedAt',
            sortByChanged: false,
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
    
    checkTerm = () => {
        
        let searchTerm = this.state.searchTerm;
        
        if (searchTerm !== '') {
            this.getStories();
        } else {
            this.setState({ searchText: 'Please enter a valid search term.'});
        }
        
    }
    
    changeSort = (e) => {

        if (this.state.searchTerm !== '') {       
            this.setState({ sortBy: e.target.value, sortByChanged: true }, () => {
                this.getStories();
            });
        } else {
            this.setState({ sortBy: e.target.value });            
        }
        
    }
    
    getStories = () => {
        
        const NEWSAPIKEY = '18a2cbdecf3c431faa01de0278ef6e86';
        const NEWSAPIURL = `https://newsapi.org/v2/everything?q=${this.state.searchTerm}&pageSize=10&page=${this.state.searchPage}&sortBy=${this.state.sortBy}&apiKey=${NEWSAPIKEY}`;
        const OLDARTICLES = this.state.articles;

        //console.log(NEWSAPIURL);
                
        fetch(NEWSAPIURL)
        .then(r => r.json())
        
        .then(data => {  

            let newArticleList = []; 
            let currPage = this.state.searchPage;
            let totalArticles = data.totalResults; 
            let totalPages = Math.ceil(totalArticles / 10);  
            let isLastPage = false;      
            let newArticles = data.articles;

            if (currPage === totalPages) {
                isLastPage = true;    
            }

            //console.log(currPage,totalPages,isLastPage);
            
            if (!OLDARTICLES.length || this.state.searchTermChanged || this.state.sortByChanged) { 
                //if first fetch, if new search term, or if new sort method
                newArticleList = newArticles;
            } else { 
                //if there are already articles, add new ones to that list
                newArticleList = OLDARTICLES.concat(newArticles);
            }

            return (
                this.setState({ 
                    searchText: `Showing articles related to "${this.state.searchTerm}." (${convertNumber(totalArticles)} total results) `,
                    lastPage: isLastPage,
                    articles: newArticleList 
                })
            )
            
        })
        
        .catch(e => this.setState({searchText: `Error: ${e}`}));
    }
   
    loadMore = () => {
        
        let currPage = this.state.searchPage;
        let newPage = currPage + 1;
        
        this.setState({ searchPage: newPage, searchTermChanged: false, sortByChanged: false }, () => {
            this.getStories();
        });
        
    }
    
    render() {
        
        return (
            <div id="main">
                <NewsForm checkTerm={this.checkTerm} updateTerm={this.updateTerm} searchText={this.state.searchText} changeSort={this.changeSort} />
                <ArticleMarkup articles={this.state.articles} />
                <LoadMoreButton loadMore={this.loadMore} articles={this.state.articles} lastPage={this.state.lastPage} />
            </div>
        );

    } 
  
}

ReactDOM.render(
    <NewsAPI />,
    document.getElementById('newsAPI')
)

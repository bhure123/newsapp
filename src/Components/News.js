import PropTypes from 'prop-types';
import React, { useState ,useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsItem from './NewsItem';
import Spinner from './Spinner';

const News = (props) => {

   const [articles, setArticles] = useState([])
   const [loading, setLoading] = useState(true)
   const [page, setPage] = useState(1)
   const [totalResults, setTotalResults] = useState(0)
   // document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;


   const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
   };



   const updateNews = async () => {
      props.setProgress(10);

      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=2f5603074a6f44f0bef7b31e3ecb0535&page=${page}&pageSize=${props.pageSize}`;
      setLoading(true);
      let data = await fetch(url);
      props.setProgress(30);
      let parsedData = await data.json()
      props.setProgress(70);

      setArticles(parsedData.articles)
      setTotalResults(parsedData.totalResults)
      setLoading(false)

      props.setProgress(100);
   }

   useEffect(() => {
      updateNews();
   }, [])

   const fetchMoreData = async () => {
      setPage(page + 1)

      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=2f5603074a6f44f0bef7b31e3ecb0535&page=${page}&pageSize=${props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles))
      setTotalResults(parsedData.totalResults)
   };



   return (
      <>
         <h2 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
            NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
         </h2>
         {loading && <Spinner />}
         <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length !== totalResults}
            loader={<Spinner />}
         >
            <div className="container">
               <div className="row">
                  {articles.map((element) => (
                     <div className="col-md-4" key={element.url}>
                        <NewsItem
                           title={element.title ? element.title.slice(0, 45) : ""}
                           description={element.description ? element.description.slice(0, 88) : ""}
                           imageurl={element.urlToImage}
                           newsurl={element.url}
                           author={element.author}
                           date={element.publishedAt}
                           source={element.source.name}
                        />
                     </div>
                  ))}
               </div>
            </div>
         </InfiniteScroll>
      </>
   );

}
News.defaultProps = {
   country: 'in',
   pageSize: 8,
   category: 'general'
};

News.propTypes = {
   country: PropTypes.string,
   pageSize: PropTypes.number,
   category: PropTypes.string,
   // setProgress: PropTypes.func.isRequired,
};
export default News;

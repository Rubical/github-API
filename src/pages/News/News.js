import { useState, useEffect, useMemo } from "react";

import NewsCard from "./../../components/NewsCard/NewsCard";
import NewsFilter from "../../components/BtnGitHubSignIn/NewsFilter/NewsFilter";
import Loader from "./../../components/UI/Loader/Loader";
import { getPageCount, getPagesArray } from "../../utils/pages";
import cl from "./News.module.css";
import BasicPagination from "../../components/UI/pagination/Pagination";

const News = () => {
  const [news, setNews] = useState("");
  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  const getNews = async () => {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=software&pageSize=${limit}&page=${page}&apiKey=ba4d6c5338394be997a79771d2522499`
    );

    const data = await response.json();
    console.log(data);
    setNews(data.articles);
    const totalCount = 96;
    setTotalPages(getPageCount(totalCount, limit));
    setIsNewsLoading(false);
  };

  useEffect(() => {
    setIsNewsLoading(true);
    getNews();
  }, []);

  useEffect(() => {
    getNews();
  }, [page]);

  const changePage = (page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  const sortedNews = useMemo(() => {
    if (filter.sort) {
      return [...news].sort((a, b) =>
        a[filter.sort].localeCompare(b[filter.sort])
      );
    }
    return news;
  }, [filter.sort, news]);

  const sortedAndSearchedNews = useMemo(() => {
    if (sortedNews) {
      return sortedNews.filter((news) =>
        news.title.toLowerCase().includes(filter.query)
      );
    }
    return news;
  }, [filter.query, sortedNews]);

  if (news) {
    return (
      <div className={cl.containerCommon}>
        <NewsFilter filter={filter} setFilter={setFilter} />
        <div className={cl.container}>
          {isNewsLoading ? (
            <Loader />
          ) : sortedAndSearchedNews ? (
            sortedAndSearchedNews.map((item, index) => {
              return <NewsCard key={index} news={item} />;
            })
          ) : (
            <h1
              style={{
                textAlign: "center",
                marginTop: 100,
                fontSize: 50,
                color: "black",
              }}
            >
              News not found!
            </h1>
          )}
        </div>
        <div className={cl.pageBtnContainer}>
          <BasicPagination changePage={changePage} totalPages={totalPages} />
        </div>
      </div>
    );
  }
};

export default News;
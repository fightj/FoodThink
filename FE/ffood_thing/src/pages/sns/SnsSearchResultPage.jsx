import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageSlide from "../../components/base/PageSlide";
import SearchBar from "../../components/base/SearchBar";
import "../../styles/sns/SnsMain.css";
import "../../styles/sns/SnsSearchResultPage.css"

// 검색 결과를 가져오는 함수
const fetchSearchResults = async (searchQuery, pageNumber = 0, size = 12) => {
  try {
    const response = await fetch(
      `https://i12e107.p.ssafy.io/api/elasticsearch/search/feed/pagenation?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}&size=${size}`
    );
    if (!response.ok) throw new Error("검색 결과를 불러오는 데 실패했습니다.");
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("검색 요청 오류:", error);
    return { content: [], totalPages: 1 }; // 오류 발생 시 빈 결과 반환
  }
};

function SnsSearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); 
  const searchInputRef = useRef(null); // useRef로 SearchBar의 input 요소에 접근
  const observerRef = useRef(null);
  const lastElementRef = useRef(null); // 마지막 요소 감시

  // 검색 결과가 변경될 때마다 스크롤을 상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  // 검색 요청
  const fetchResults = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    const data = await fetchSearchResults(query, page);
  
    setSearchResults((prevResults) => {
      const mergedResults = [...prevResults, ...data.content];
      const uniqueResults = Array.from(new Map(mergedResults.map(item => [item.id, item])).values());
      return uniqueResults;
    });
  
    setTotalPages(data.totalPages);
    setLoading(false);
  }, [query, page, loading]);
  

  useEffect(() => {
    if (query.trim()) {
      setPage(0);
    }
  }, [query]);
  
  useEffect(() => {
    fetchResults();
  }, [query, page]); // page가 변경될 때만 fetchResults 실행
  

  // Intersection Observer 적용
  useEffect(() => {
    if (loading || page + 1 >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) observer.unobserve(lastElementRef.current);
    };
  }, [loading, totalPages]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(0);
    setSearchResults([]);
    navigate(`/search-results?query=${newQuery}`);
  };

  return (
    <PageSlide>
      <div className="base-div">
        <SearchBar onSearch={handleSearch} initialQuery={query} inputRef={searchInputRef} />
        
        <div className="card-div">
          <div className="container px-4 py-5">
            <div className="d-flex justify-content-between align-items-center pb-2">
              {/* 이전 버튼 클릭 시, 이전 페이지로 이동 */}
              <button onClick={() => navigate('/sns')} className="back-button">
                <img src="/images/previous_button.png" alt="Previous" className="icon" />
                &nbsp;&nbsp;이전
              </button>
              {/* 검색 결과 텍스트는 화면 중앙 정렬 */}
              <h2 className="search-result-title">검색 결과: "{query}"</h2>
            </div>

            <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
              {searchResults.length > 0 ? (
                searchResults.map((feedItem, index) => (
                  <div className="col" key={feedItem.id} ref={index === searchResults.length - 1 ? lastElementRef : null}>
                    <Link to={`/feed/${feedItem.id}`} style={{ textDecoration: "none" }}>
                      <div
                        className="card card-cover h-100 overflow-hidden rounded-4 feed-card"
                        style={{
                          backgroundImage: `url(${feedItem.image})`,
                        }}
                      >
                        {feedItem.imageSize > 1 && (
                          <div className="image-icon">
                            <img src="/images/pages.png" alt="Multiple images" />
                          </div>
                        )}
                        <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                          <div className="user-info">
                            <img
                              src={feedItem.userImage || "/images/default_profile.png"}
                              alt={feedItem.userNickname}
                              className="profile-image-main"
                            />
                            <span>{feedItem.userNickname}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="align-items-stretch sns-search-no-result">검색 결과가 없습니다.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageSlide>
  );
}

export default SnsSearchResultPage;

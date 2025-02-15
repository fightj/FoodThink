import React, { useState, useEffect, useRef } from "react";
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
  const searchInputRef = useRef(null); // useRef로 SearchBar의 input 요소에 접근

  // 검색 결과가 변경될 때마다 스크롤을 상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤 이동
  }, [searchResults]);
  
  // query가 변경될 때마다 바로 검색
  useEffect(() => {
    if (query.trim()) {
      const fetchResults = async () => {
        const data = await fetchSearchResults(query, page);
        setSearchResults(data.content);
        setTotalPages(data.totalPages);
      };

      fetchResults();
    } else {
      setSearchResults([]);
      setTotalPages(1);
    }
  }, [query, page]);

  // 검색바에서 검색어를 입력하면 query 상태를 업데이트하고 페이지를 첫 번째로 초기화
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(0); // 새 검색 시 첫 페이지부터 시작
    navigate(`/search-results?query=${newQuery}`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value); // 입력값이 변경될 때마다 query 상태 업데이트
  };

  // 페이지네이션 처리
  const handlePagination = (direction) => {
    if (direction === "prev" && page > 0) {
      setPage(page - 1);
    } else if (direction === "next" && page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  // 컴포넌트가 처음 렌더링될 때, 검색창에 포커스를 설정
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []); // 처음 한 번만 실행

  return (
    <PageSlide>
      <div className="base-div">
        <SearchBar
          onSearch={handleSearch}
          initialQuery={query}
          onChange={handleChange}
          inputRef={searchInputRef} // ref를 전달
        />
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
                searchResults.map((feedItem) => (
                  <div className="col" key={feedItem.id}>
                    <Link to={`/feed/${feedItem.id}`} style={{ textDecoration: "none" }}>
                      <div
                        className="card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg feed-card"
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
                              src={feedItem.userImage || "/images/default-profile.png"}
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
                <p>검색 결과가 없습니다.</p>
              )}
            </div>

            {/* 페이지네이션 추가 */}
            <div className="pagination">
              <button disabled={page === 0} onClick={() => handlePagination("prev")}>
                이전
              </button>
              <span>
                {page + 1} / {totalPages}
              </span>
              <button disabled={page + 1 >= totalPages} onClick={() => handlePagination("next")}>
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSlide>
  );
}

export default SnsSearchResultPage;

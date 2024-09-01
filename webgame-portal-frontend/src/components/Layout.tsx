import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { logoutUser } from "../store/userSlice";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: #171a21;
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NavLink = styled(Link)`
  color: #c6d4df;
  text-decoration: none;
  margin-right: 1rem;
  &:hover {
    color: #ffffff;
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
`;

const Footer = styled.footer`
  background-color: #171a21;
  color: #8f98a0;
  padding: 1rem 0;
  text-align: center;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn, username } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <LayoutWrapper>
      <Header>
        <Nav>
          <div>
            <NavLink to="/">ホーム</NavLink>
            <NavLink to="/games">ゲーム一覧</NavLink>
          </div>
          <div>
            {isLoggedIn ? (
              <>
                <NavLink to="/profile">プロフィール</NavLink>
                <NavLink to="/upload-game">Webゲームを投稿</NavLink>
                <NavLink to="/" onClick={handleLogout}>
                  ログアウト
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login">ログイン</NavLink>
                <NavLink to="/register">登録</NavLink>
              </>
            )}
          </div>
        </Nav>
      </Header>
      <MainContent>{children}</MainContent>
      <Footer>
        <p>&copy; 2024 Webゲームポータル</p>
      </Footer>
    </LayoutWrapper>
  );
};

export default Layout;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { logoutUser } from "../store/userSlice";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.header`
  background-color: #333;
  color: white;
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-right: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  padding: 1rem 0;
  margin-top: 2rem;
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
                <span>ようこそ、{username}さん</span>
                <NavLink to="/profile">プロフィール</NavLink>
                <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
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
      <main>{children}</main>
      <Footer>
        <p>&copy; 2024 Webゲームポータル</p>
      </Footer>
    </LayoutWrapper>
  );
};

export default Layout;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store";
import Layout from "../components/Layout";
import {
  Card,
  Button,
  Avatar as MUIAvatar,
  Typography,
  Grid,
  Box,
  styled as muiStyled,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { fetchUserProfile, UserProfile } from "../services/userService";
import { fetchDeveloperGames, IGame } from "../services/gameService";

// MUIコンポーネントのカスタマイズ
const StyledCard = muiStyled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ProfileHeader = muiStyled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
});

const Avatar = muiStyled("img")({
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  marginRight: "20px",
});

const UserInfo = muiStyled("div")({
  flex: 1,
});

const Username = muiStyled("h2")({
  margin: 0,
});

const Email = muiStyled("p")({
  margin: "5px 0",
  color: "#666",
});

const DeveloperStatus = muiStyled("span")({
  backgroundColor: "#4caf50",
  color: "white",
  padding: "5px 10px",
  borderRadius: "15px",
  fontSize: "0.8em",
});

const EditProfileButton = muiStyled(Link)({
  backgroundColor: "#007bff",
  color: "white",
  padding: "5px 15px",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "0.9em",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
});

const DashboardSection = muiStyled("div")({
  backgroundColor: "#f8f9fa",
  borderRadius: "5px",
  padding: "20px",
  marginBottom: "20px",
});

const SectionTitle = muiStyled("h3")({
  marginTop: 0,
});

const GameList = muiStyled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
});

const GameItem = muiStyled("div")({
  backgroundColor: "white",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "15px",
});

const GameTitle = muiStyled("h4")({
  marginTop: 0,
});

const GameStats = muiStyled("p")({
  margin: "5px 0",
  fontSize: "0.9em",
  color: "#666",
});

const EditGameButton = muiStyled(Link)({
  display: "inline-block",
  backgroundColor: "#ffc107",
  color: "black",
  padding: "5px 10px",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "0.8em",
  "&:hover": {
    backgroundColor: "#e0a800",
  },
});

const UploadButton = muiStyled(Link)({
  display: "inline-block",
  backgroundColor: "#28a745",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#218838",
  },
});

const DeveloperDashboardPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    const loadProfileAndGames = async () => {
      if (userId) {
        try {
          const profileData = await fetchUserProfile(userId);
          setProfile(profileData);
          const gamesData = await fetchDeveloperGames();
          setGames(gamesData);
        } catch (error) {
          console.error(
            "プロフィールまたはゲームの読み込みに失敗しました",
            error
          );
        }
      }
    };

    loadProfileAndGames();
  }, [userId]);

  if (!profile) {
    return <Layout>読み込み中...</Layout>;
  }

  return (
    <Layout>
      <StyledCard>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MUIAvatar
              src={profile.avatarUrl || "/default-avatar.png"}
              alt={profile.username}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4">{profile.username}</Typography>
            <Typography variant="body1" color="textSecondary">
              {profile.email}
            </Typography>
            {profile.bio && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {profile.bio}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/profile/edit"
              sx={{ textDecoration: "none", marginRight: 2 }}
            >
              プロフィール編集
            </Button>
          </Grid>
        </Grid>
      </StyledCard>

      <StyledCard>
        <Typography variant="h5" gutterBottom>
          開発者ダッシュボード
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/upload-game"
          sx={{ textDecoration: "none", marginRight: 2 }}
        >
          新規ゲームをアップロード
        </Button>
      </StyledCard>

      <StyledCard>
        <Typography variant="h5" gutterBottom>
          開発したゲーム
        </Typography>
        <Grid container spacing={3}>
          {games.map((game) => (
            <Grid item xs={12} sm={6} md={4} key={game._id}>
              <Card>
                <Box p={2}>
                  <Typography variant="h6">{game.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    アップロード日:{" "}
                    {new Date(game.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    プレイ回数: {game.playCount}
                  </Typography>
                  <Typography variant="body2">評価: {game.rating}/5</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`/edit-game/${game._id}`}
                    size="small"
                    sx={{ textDecoration: "none", marginRight: 2 }}
                  >
                    編集
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </StyledCard>
    </Layout>
  );
};

export default DeveloperDashboardPage;

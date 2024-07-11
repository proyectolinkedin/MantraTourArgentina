import  { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Grid, CircularProgress } from "@mui/material";

const images = [
  "/images/travel1.jpg",
  "/images/travel2.jpg",
  "/images/travel3.jpg",
  "/images/travel4.jpg",
];

const TravelPuzzle = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
      <CardHeader title="Puzzle Challenge" subheader="Drag and drop the puzzle pieces to complete the image." />
      <CardContent>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={2}>
            {images.map((src, index) => (
              <Grid item xs={3} key={index} sx={{ cursor: "grab" }}>
                <img src={src} alt={`Puzzle piece ${index}`} style={{ width: "100%", borderRadius: "8px" }} />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelPuzzle;

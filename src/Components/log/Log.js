import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import GoalTracker from "./GoalTracker";

const useStyles = makeStyles({
  root: {
    paddingTop: "25px",
    paddingBottom: "56px",
    justifyContent: "center",
  },
  dateContainer: {
    marginTop: "25px",
    justifyContent: "center",
  },
  Paper: {
    width: "100%",
    margin: "12.5px",
    backgroundColor: "#303030",
    color: "#000000",
  },
  categoryBackground: {
    backgroundColor: "#1B1B1B",
    width: "100%",
    height: "100%",
    padding: "15px",
    borderRadius: "5px",
  },
  goalContainer: {
    justifyContent: "center",
    backgroundColor: "#303030",
    borderRadius: '4px',
  },
  ArrowButton: {
    color: "#fff",
  },
});

export const Log = () => {
  const classes = useStyles();
  const goals = useSelector((state) => state.goals);
  const user = useSelector((state) => state.user);
  const [toggleAchievedView, setToggleAchievedView] = useState(true);

  // format a Date object like ISO
  const dateToISOLikeButLocal = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal = date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    const iso = dateLocal.toISOString();
    const isoLocal = iso.slice(0, 19);
    return isoLocal;
  };

  // set the log date to today
  const [selectedDate, setSelectedDate] = useState(dateToISOLikeButLocal(new Date()).substr(0, 10));

  // handles when arrow buttons are clicked
  const changeDate = (change) => {
    let newDate = new Date(selectedDate).setDate(new Date(selectedDate).getDate() + change);
    setSelectedDate(new Date(newDate).toISOString().substr(0, 10));
  };

  // gathers daily history for calculating progress percentages
  let allGoalsStatsToday = goals
    .map((goal) => ({
      history: goal.history,
      category: goal.category,
      defaultTarget: goal.defaultTarget,
    }))
    .map((goal) => {
      // filteredHistory will return an array with a single object of the selected date
      const filteredHistory = goal.history.filter((day) => day.date === selectedDate)[0];
      // if filteredHistory is null, it will use the filler history
      const fillerHistory = {
        date: selectedDate,
        targetPerDuration: goal.defaultTarget,
        achieved: 0,
      };
      return {
        stats: filteredHistory ? filteredHistory : fillerHistory,
        category: goal.category,
        defaultTarget: goal.defaultTarget,
      };
    });

  let categories = [];

  goals.forEach((goal) => {
    if (!categories.includes(goal.category)) {
      categories.push(goal.category);
    }
  });

  const getCategoryProgress = (c) => {
    let categoryHistory = allGoalsStatsToday.filter((goal) => goal.category === c);
    let achievedTotal = 0;
    let goalTotal = 0;

    categoryHistory.forEach((goal) => {
      achievedTotal += goal.stats.achieved;
      goalTotal += goal.stats.targetPerDuration;
    });

    return (achievedTotal / goalTotal) * 100;
  };

  return !user ? (
    <Redirect to={{ pathname: "/login" }} />
  ) : (
    <Container maxWidth="md">
      <Grid container className={classes.root}>
        <Grid container item xs={12} sx={{justifyContent: 'flex-end',}} >
          <Button variant="contained" onClick={()=>setToggleAchievedView((prev => !prev))}>{toggleAchievedView?'#':'%'}</Button>
        </Grid>
        <Grid item xs={12} container className={classes.dateContainer}>
          <Button onClick={() => changeDate(-1)} className={classes.ArrowButton}>
            <ArrowBack sx={{ color: "#F9F9F9" }} />
          </Button>
          <TextField
            id="date"
            label="Date"
            type="date"
            variant="standard"
            value={selectedDate}
            className={classes.TextField}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            onClick={() => changeDate(1)}
            className={classes.ArrowButton}
            sx={{ color: "#F9F9F9" }}
          >
            <ArrowForward />
          </Button>
        </Grid>
        {categories.map((category) => {
          let categoryPercent = getCategoryProgress(category);
          return (
            <Paper variant="outlined" className={classes.Paper} key={category} >
              <Grid container item xs={12} className={classes.goalContainer}>
                <Grid item xs={12} className={classes.categoryBackground}>
                  <Typography variant="h6">{category}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={isNaN(categoryPercent) ? 0 : categoryPercent}
                  />
                </Grid>
                {goals.map((goal, index) => (
                  <GoalTracker
                    key={`${goal.task}-${index}`}
                    goal={goal}
                    index={index}
                    category={category}
                    selectedDate={selectedDate}
                    toggleAchievedView={toggleAchievedView}
                  />
                ))}
              </Grid>
            </Paper>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Log;

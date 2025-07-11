import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivities } from "../../Redux/actions";
import { Navigate } from "react-router";
import {
  Button,
  Container,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  AddCircle,
  FilterList,
  Category,
  Flaky,
} from "@mui/icons-material";
import GoalCircularProgress from "./GoalCircularProgress";
import Categories from "./EditCategories";
import NewGoal from "./NewGoal";
import dayjs from "dayjs";

const classes = {
  root: {
    paddingTop: "25px",
    paddingBottom: "56px",
    justifyContent: "center",
  },
  dateContainer: {
    justifyContent: "center",
  },
  Paper: {
    width: "100%",
    margin: "12.5px",
  },
  categoryBackground: {
    backgroundColor: "background.categoryBackground",
    width: "100%",
    height: "100%",
    padding: "15px",
    borderRadius: "5px",
  },
  goalContainer: {
    justifyContent: "center",
    backgroundColor: "background.goalContainer",
    borderRadius: "4px",
  },
};

export const LogContainer = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.goals);
  const user = useSelector((state) => state.user);
  const categories = useSelector((state) => state.categories);
  const [toggleAchievedView, setToggleAchievedView] = useState(true);
  const [toggleCategoryView, setToggleCategoryView] = useState(false);
  const [toggleNewTaskView, setToggleNewTaskView] = useState(false);
  const [sortBy, setSortBy] = useState(true);
  const [loading, setLoading] = useState(true);

  // set the log date to today
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));

  useEffect(() => {
    setLoading(true);
    dispatch(getActivities(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"))).then(() => setLoading(false));
    // eslint-disable-next-line
  }, [selectedDate]);

  const handleSelectedDateChange = (e) => {
    if (e.target.value && e.target.value !== "") {
      setSelectedDate(e.target.value);
    } else {
      console.log(`Invalid date selected: '${e.target.value}'`);
    }
  };

  // handles when arrow buttons are clicked
  const changeDate = (change) => {
    const newDate = dayjs(selectedDate).add(change, "day").format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  const handleSortToggle = () => setSortBy((prev) => !prev);

  // gathers daily history for calculating progress percentages
  let allGoalsStatsToday = goals
    .filter((goal) => !goal.hidden)
    .map((goal) => ({
      history: goal.history,
      category: goal.category,
      defaultTarget: goal.defaultTarget,
    }))
    .map((goal) => {
      // filteredHistory will return an array with a single object of the selected date
      const filteredHistory =
        goal.history.find(
          (day) => dayjs(day.date).add(1, "day").format("YYYY-MM-DD") === selectedDate
        ) || goal.history.find((day) => dayjs(day.date).format("YYYY-MM-DD") === selectedDate);
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

  let goalCategories = [];

  goals.forEach((goal) => {
    if (!goalCategories.includes(goal.category)) {
      goalCategories.push(goal.category);
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

  const getAllProgress = () => {
    let achievedTotal = 0;
    let goalTotal = 0;

    allGoalsStatsToday.forEach((goal) => {
      achievedTotal += goal.stats.achieved;
      goalTotal += goal.stats.targetPerDuration;
    });

    return (achievedTotal / goalTotal) * 100;
  };

  return !user ? (
    <Navigate to={{ pathname: "/login" }} />
  ) : (
    <Container maxWidth="md">
      <Grid container sx={classes.root}>
        <Grid size={12} container sx={classes.dateContainer}>
          <Button onClick={() => changeDate(-1)}>
            <ArrowBack color="action" />
          </Button>
          <TextField
            id="date"
            label="Date"
            type="date"
            variant="standard"
            value={selectedDate}
            onChange={handleSelectedDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button onClick={() => changeDate(1)}>
            <ArrowForward color="action" />
          </Button>
        </Grid>
        <Dialog open={toggleCategoryView} onClose={() => setToggleCategoryView(false)}>
          <Categories categories={categories} setToggleCategoryView={setToggleCategoryView} />
        </Dialog>
        <Dialog open={toggleNewTaskView} onClose={() => setToggleNewTaskView(false)}>
          <NewGoal categories={categories} setToggleNewTaskView={setToggleNewTaskView} />
        </Dialog>
        <Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
          <Grid sx={{ justifyContent: "center", alignItems: "center" }}>
            <IconButton size="large" onClick={handleSortToggle}>
              <FilterList color="action" />
            </IconButton>
          </Grid>
          <Grid sx={{ justifyContent: "center", alignItems: "center" }}>
            <IconButton size="large" onClick={() => setToggleCategoryView((prev) => !prev)}>
              <Category color="action" />
            </IconButton>
          </Grid>
          <Grid sx={{ justifyContent: "center", alignItems: "center" }}>
            <IconButton size="large" onClick={() => setToggleNewTaskView((prev) => !prev)}>
              <AddCircle color="action" />
            </IconButton>
          </Grid>
          <Grid sx={{ justifyContent: "center", alignItems: "center" }}>
            <IconButton size="large" onClick={() => setToggleAchievedView((prev) => !prev)}>
              <Flaky color="action" />
            </IconButton>
          </Grid>
        </Grid>
        {loading ? (
          <Grid container size={12} justifyContent="center">
            Loading
          </Grid>
        ) : sortBy ? (
          categories
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              let categoryPercent = getCategoryProgress(category.category);
              return (
                <Paper variant="outlined" sx={classes.Paper} key={category.category}>
                  <Grid container size={12} sx={classes.goalContainer}>
                    <Grid size={12} sx={classes.categoryBackground}>
                      <Typography variant="h6">{category.category}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          isNaN(categoryPercent) ? 0 : categoryPercent > 100 ? 100 : categoryPercent
                        }
                      />
                    </Grid>
                    {goals
                      .filter((goal) => !goal.hidden)
                      .sort((a, b) => a.order - b.order)
                      .map((goal, index) => (
                        <GoalCircularProgress
                          key={`${goal.task}-${index}`}
                          goal={goal}
                          history={goal.history}
                          index={index}
                          category={category.category}
                          selectedDate={selectedDate}
                          toggleAchievedView={toggleAchievedView}
                          categories={categories}
                        />
                      ))}
                  </Grid>
                </Paper>
              );
            })
        ) : (
          <Paper variant="outlined" sx={classes.Paper}>
            <Grid container size={12} sx={classes.goalContainer}>
              <Grid size={12} sx={classes.categoryBackground}>
                <Typography variant="h6">All</Typography>
                <LinearProgress
                  variant="determinate"
                  getAllProgress
                  value={
                    isNaN(getAllProgress()) ? 0 : getAllProgress() > 100 ? 100 : getAllProgress()
                  }
                />
              </Grid>
              {goals
                .sort((a, b) => a.task > b.task)
                .map((goal, index) => (
                  <GoalCircularProgress
                    key={`${goal.task}`}
                    goal={goal}
                    history={goal.history}
                    index={index}
                    category={goal.category}
                    selectedDate={selectedDate}
                    toggleAchievedView={toggleAchievedView}
                    categories={categories}
                  />
                ))}
            </Grid>
          </Paper>
        )}
      </Grid>
    </Container>
  );
};

export default LogContainer;

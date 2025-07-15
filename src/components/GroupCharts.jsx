import * as d3 from "d3";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export default function GroupCharts({ posts, authors }) {
  const barRef = useRef();
  const lineRef = useRef();

  useEffect(() => {
    drawBarChart();
    drawLineChart();
  }, [posts, authors]);

  const drawBarChart = () => {
    const counts = {};
    posts.forEach((p) => {
      const name = authors[p.author_id] || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });

    const data = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    d3.select(barRef.current).selectAll("*").remove();
    const svg = d3
      .select(barRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("fill", "#1976d2")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => y(0) - y(d.count))
      .attr("width", x.bandwidth());

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  const drawLineChart = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    // Init date map with 0s
    const dateCounts = {};
    const dateLabels = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekAgo);
      d.setDate(d.getDate() + i);
      const label = d.toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "2-digit",
      }); // dd/mm
      dateLabels.push(label);
      dateCounts[label] = 0;
    }

    // Count posts per day
    posts.forEach((p) => {
      const d = new Date(p.created_at);
      const dateLabel = d.toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "2-digit",
      });
      if (dateCounts.hasOwnProperty(dateLabel)) {
        dateCounts[dateLabel]++;
      }
    });

    const data = dateLabels.map((label) => ({
      date: label,
      count: dateCounts[label],
    }));

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    d3.select(lineRef.current).selectAll("*").remove();
    const svg = d3
      .select(lineRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => x(d.date) + x.bandwidth() / 2)
      .y((d) => y(d.count));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#43a047")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
      <Box>
        <h4>Posts per user 📊</h4>
        <svg ref={barRef} />
      </Box>
      <Box>
        <h4>Post per day 📈</h4>
        <svg ref={lineRef} />
      </Box>
    </Box>
  );
}

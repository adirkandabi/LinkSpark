import * as d3 from "d3";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

export default function GroupCharts({ posts, authors }) {
  const barRef = useRef();
  const lineRef = useRef();

  useEffect(() => {
    drawBarChart();
    drawLineChart();
  }, [posts]);

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

    d3.select(barRef.current).selectAll("*").remove(); // reset
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
      .domain([0, d3.max(data, (d) => d.count)])
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
    const groupedByDate = {};
    posts.forEach((p) => {
      const date = new Date(p.created_at).toLocaleDateString();
      groupedByDate[date] = (groupedByDate[date] || 0) + 1;
    });

    const data = Object.entries(groupedByDate)
      .map(([date, count]) => ({ date: new Date(date), count }))
      .sort((a, b) => a.date - b.date);

    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    d3.select(lineRef.current).selectAll("*").remove(); // reset
    const svg = d3
      .select(lineRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => x(d.date))
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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d/%m")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <div>
      <Box display="flex" gap={4} flexWrap="wrap">
        <Box>
          <h4>Posts per user 📊</h4>
          <svg ref={barRef} />
        </Box>
        <Box>
          <h4>Post per day 📈</h4>
          <svg ref={lineRef} />
        </Box>
      </Box>
    </div>
  );
}

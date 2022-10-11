let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let req = new XMLHttpRequest();

let data = [];

let xScale;
let yScale;

let xAxis;
let yAxis;

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
               .domain([d3.min(data, (item)=>{
                    return item['Year']
                }) - 1, d3.max(data, (item)=>{
                    return item['Year']
                }) + 1])
               .range([padding, width-padding])

    yScale = d3.scaleTime()
               .domain([d3.min(data, (item)=>{
                return new Date(item['Seconds']*1000); 
               }), d3.max(data, (item)=>{
                console.log(item['Seconds'])
                return new Date(item['Seconds']*1000); 
               })])
               .range([padding, height-padding])

}

let generateAxes = () => {
    xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format('d'))

    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (height-padding) + ')')


    yAxis = d3.axisLeft(yScale)
              .tickFormat(function(d) {
                const minutes = Math.floor(d/60000);
                const seconds = ((d % 60000) / 1000).toFixed(0);
                return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
              })


    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')

}

let drawScatter = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')
    
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'dot')
        .attr('data-xvalue', (item)=> {
            return item['Year']
        })
        .attr('data-yvalue', (item)=> {
            return item['Time']
        })
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds']*1000))
        })
        .attr("cx", (item)=>{
            return xScale(item['Year'])
        })
        .attr("r", 5)
        .attr("fill", (item)=>{
            if (item['URL']===''){
                return 'orange'
            } else {
                return 'blue'
            }
        })
        .on('mouseover', (e, item) => {
            tooltip.transition()
                    .style('visibility', 'visible')
            
            tooltip.text(item['Name'] + " : " + item['Nationality'] + "\n\r" + 
            "Year: " + item['Year'] + ", " + "Time: " + item['Time'] + " \n\n" + item['Doping'])


        })
        .on('mouseout', (e,item)=>{
            tooltip.transition()
                   .style('visibilty', 'hidden')
        })
    
}

req.open('GET', url, true);
req.onload = () => {
    data = JSON.parse(req.responseText)
    console.log(data);
    drawCanvas();
    generateScales();
    drawScatter();
    generateAxes();
}
req.send();
let queryURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {

    let dropdownMenu = d3.select("#selDataset");

    d3.json(queryURL).then((data) => {
        console.log(`Data: ${data}`);

        let names = data.names;

        names.forEach((name) => {
   
            dropdownMenu.append("option").text(name).property("value", name);
        });

        let name = names[0];

        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

function demo(selectedValue) {
    d3.json(queryURL).then((data) => {
        console.log(`Data: ${data}`);

        let metadata = data.metadata;
        

        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        let obj = filteredData[0]
        
        d3.select("#sample-metadata").html("");
  
        let entries = Object.entries(obj);
        
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        console.log(entries);
    });
  }
  

function bar(selectedValue) {
    d3.json(queryURL).then((data) => {
        console.log(`Data: ${data}`);

        let samples = data.samples;

        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        let obj = filteredData[0];

        console.log("obj:", obj); 

        if (obj && obj.sample_values) {
            let trace = [{
                x: obj.sample_values.slice(0, 5).reverse(),
                y: obj.otu_ids.slice(0, 5).map((otu_id) => `OTU ${otu_id}`).reverse(),
                text: obj.otu_labels.slice(0, 5).reverse(),
                type: "bar",
                marker: {
                    color: "rgb(155,170,236)"
                },
                orientation: "h"
            }];

            Plotly.newPlot("bar", trace);
        } else {
            console.error("obj.sample_values is undefined or null");
        }
    });
}

  
function bubble(selectedValue) {
    d3.json(queryURL).then((data) => {

        let samples = data.samples;
    
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        let obj = filteredData[0];
        
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Sunset"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        Plotly.newPlot("bubble", trace, layout);
    });
}

function gauge(selectedValue) {
    d3.json(queryURL).then((data) => {
        let metadata = data.metadata;
        
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        let obj = filteredData[0]

        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "rgb(68,166,198)"},
                steps: [
                    { range: [0, 1], color: "rgb(205, 230, 255)" },
                    { range: [1, 2], color: "rgb(180, 215, 240)" },
                    { range: [2, 3], color: "rgb(155, 200, 225)" },
                    { range: [3, 4], color: "rgb(130, 185, 210)" },
                    { range: [4, 5], color: "rgb(105, 170, 195)" },
                    { range: [5, 6], color: "rgb(80, 155, 180)" },
                    { range: [6, 7], color: "rgb(55, 140, 165)" },
                    { range: [7, 8], color: "rgb(30, 125, 150)" },
                    { range: [8, 9], color: "rgb(5, 110, 135)" },
                    { range: [9, 10], color: "rgb(0, 95, 120)" }
                    
                ]
            }
        }];

         Plotly.newPlot("gauge", trace);
    });
}

function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();
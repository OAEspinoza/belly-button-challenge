let jFile = "samples.json"

// INFO BOX
function DempgraphicsBox(sample)
{
    // data extraction
    d3.json(jFile).then((data) => {
        // get data
        let metaData = data.metadata;
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        let resultinfo = result[0];
        // clear info
        d3.select("#sample-metadata").html("");
        // get values
        Object.entries(resultinfo).forEach(([key, value]) => {
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
};

// BAR CHART and GAUGE CHART
function BarChart(sample)
{
    // BARCHART
    // data extraction
    d3.json(jFile).then((data) => {
        // get sample data
        let sample_info = data.samples;
        // filter
        let result = sample_info.filter(sampleResult => sampleResult.id == sample);
        // access index 0
        let resultinfo = result[0];
        // get values
        let otu_ids = resultinfo.otu_ids;
        let otu_labels = resultinfo.otu_labels;
        let sample_values = resultinfo.sample_values;
        // top 10
        let yticks = otu_ids.slice(0, 10).map(id => `OTU-${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);
        // chart
        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: "Top 10"
        };
        Plotly.newPlot("bar", [barChart], layout)

    // GAUGE CHART
        let metaData = data.metadata;
        let metaresult = metaData.filter(sampleResult => sampleResult.id == sample);
        let metaresultinfo = metaresult[0];
        let wf=metaresultinfo.wfreq;
        var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: wf,
              title: { text: "Wash Frequency", font: { size: 24 } },
              gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "black" },
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 3,
                bordercolor: "gray",
                steps: [
                  { range: [0, 3], color: "cyan" },
                  { range: [3, 6], color: "royalblue" },
                  { range: [6, 9], color: "blue" }
                ],
              }
            }
          ];         
          let gagelayout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            // paper_bgcolor: "lavender",
            // font: { color: "darkblue", family: "Arial" }
          };
          Plotly.newPlot('gauge', data, gagelayout);
    });
};

// BUBBLE CHART
function BubbleChart(sample)
{
     // data extraction
     d3.json(jFile).then((data) => {
        // get data
        let sample_info = data.samples;
        let result = sample_info.filter(sampleResult => sampleResult.id == sample);
        let resultinfo = result[0];
        // get values
        let otu_ids = resultinfo.otu_ids;
        let otu_labels = resultinfo.otu_labels;
        let sample_values = resultinfo.sample_values;
        // bubble chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Blues"
            }
        };
        let layout = {
            title: "Cultures per sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Amount Present"}
        };
        Plotly.newPlot("bubble", [bubbleChart], layout)
    });
};

// DASHBOARD
function start_up()
{
    var select = d3.select("#selDataset");
    d3.json(jFile).then((data) => {
        let sampleNames = data.names;
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });
        // info first sample
        let first_sample = sampleNames[0];
        // call functions
        DempgraphicsBox(first_sample);
        BarChart(first_sample);
        BubbleChart(first_sample);
    });    
};

// UPDATE
function optionChanged(item)
{
    DempgraphicsBox(item);
    BarChart(item);
    BubbleChart(item);
}

start_up();
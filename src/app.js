import $ from "jquery";
import './app.css';

function fill_in_table (divid, data){
  //create table dinamically
  var table = document.getElementById(divid);
  
  var row = table.insertRow(-1);
  row.insertCell(0).innerHTML = "<b>&#8595; TOOL / CHALLENGE &#8594; </b>";

  // append rows with all participants in the benchmark
  Object.keys(data[Object.keys(data)[0]])
      .sort()
      .forEach(function(toolname, i) {
      var row = table.insertRow(-1);
      var cell = row.insertCell(0);
      cell.innerHTML = toolname;
      cell.id = toolname;
      // row.insertCell(1).innerHTML = data[key]["MuSiC"];
  });
  // append columns with challenges and results
  Object.keys(data)
      .sort()
      .forEach(function(key, i) {
        var column_values = [key];
        Object.keys(data[key])
        .sort()
        .forEach(function(toolname, j) {
            column_values.push(data[key][toolname])
        });
        // open loop for each row and append cell
        for ( var i = 0; i < table.rows.length; i++) {
            var cell = table.rows[i].insertCell(table.rows[i].cells.length);
            cell.innerHTML = column_values[i];
            if (i == 0) {
                var url = "https://dev-openebench.bsc.es/html/scientific/TCGA/TCGA:2018-04-05/TCGA:2018-04-05";
                var url = document.URL;
                url = url + "/" + url.split("/").pop() + "_" + key;

                cell.id = column_values[i];
                cell.innerHTML = "<a href='" + url + "' >"+column_values[i]+"</a>";
            }
        };

        });

  

};

function set_cell_colors(){

  var cell = $('td'); 

  cell.each(function() { //loop through all td elements ie the cells

      var cell_value = $(this).html(); //get the value

      if (cell_value == "1") { //if then for if value is 1
      $(this).css({'background' : '#238b45'});   
      } else {
      $(this).css({'background' : '#ffffff'});
      };

  });

  };

  async function fetchUrl(url) {

    try {
      let request1 = await fetch(url);
      let result = await request1.text();

        return JSON.parse(result);
      }
      catch (err) {
        console.log(`Invalid Url Error: ${err.stack} `);
      }
  
  };


function compute_classification(selected_classifier){

    // every time a new classification is compute the previous results table is deleted (if it exists)
    if (document.getElementById("bench_summary_table") != null) {
        document.getElementById("bench_summary_table").innerHTML = '';
    };

    var path_data = $('#bench_summary_table').data("input") + "/" + selected_classifier;
    path_data = "https://dev-openebench.bsc.es/bench_event/api/" + path_data;

    fetchUrl(path_data).then(results => {
  
      fill_in_table("bench_summary_table", results);
      set_cell_colors();
    });
};


function load_table(){

 
    var list = document.getElementById("bench_dropdown_list");

    list.addEventListener('change', function(d) {
        compute_classification(this.options[this.selectedIndex].id.split("__")[1]);
      });
    
    var group = document.createElement("OptGroup");
    group.label = "Select a classification method:";
    list.add(group);
    //

    var option1 = document.createElement("option");
    option1.class ="selection_option";
    option1.id = "classificator__squares";
    option1.title = "Apply square quartiles classification method (based on the 0.5 quartile of the X and Y metrics)";
    option1.data = ("toggle", "list_tooltip");
    option1.data = ("container", "#tooltip_container");
    option1.innerHTML= "SQUARE QUARTILES";

    var option2 = document.createElement("option");
    option2.class ="selection_option";
    option2.id = "classificator__diagonals";
    option2.title = "Apply diagonal quartiles classifcation method (based on the assignment of a score to each participant proceeding from its distance to the 'optimal performance' corner)";
    option2.data = ("toggle", "list_tooltip");
    option2.data = ("container", "#tooltip_container");
    option2.selected="disabled";
    option2.innerHTML= "DIAGONAL QUARTILES";

    var option3 = document.createElement("option");
    option3.class ="selection_option";
    option3.id = "classificator__clusters";
    option3.title = "Apply k-means clustering algorithm to group the participants";
    option3.data = ("toggle", "list_tooltip");
    option3.data = ("container", "#tooltip_container");
    option3.innerHTML= "K-MEANS CLUSTERING";
    
    group.appendChild(option1);
    group.appendChild(option2);
    group.appendChild(option3);
    
    var selected_classifier = list.options[list.selectedIndex].id.split("__")[1];
    compute_classification(selected_classifier);
};
  
export { load_table };
// load_table();
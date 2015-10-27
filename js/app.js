$(document).ready(function(){


    var getDataJson; //Global Data Json
    var getLabelColumns; //Global Columns
    var indexOfLabelColumn;
    var indexOfDateColumn;
    var indexOfVariableColumn;

    /**
     * load all json data
     * @return json
     */
    function loadJsonData() {
        $.ajax({
            url: 'results.json',
            type: 'POST',
            dataType : 'json',
            async: false,
            success: function(data){
                getDataJson = data;
            }
        });
    }




    /**
     * load columns
     * @param  
     * @return 
     */
    function loadColumns() {
        // var nameArray = unique(getLabelColumns);
        //Delete Column Khách Hàng
        var option;
        $.each(getLabelColumns, function(key, value) {
            var arr = key.split('-');
            if (arr[1]) {
                option += '<option value="'+ key +'">'+ arr[1] + ' (' + value + ') ' +'</option>';
            }
        });
        $('#columns').append(option);

        
        $('#columns[multiple]').multiselect({
            columns: 4,
            placeholder: 'Select Columns'
        });
    }


    /**
     * load all column data
     * @return json
     */
    function loadLabelColumns() {
        $.ajax({
            url: 'datatype.json',
            type: 'POST',
            dataType : 'json',
            async: false,
            success: function(data){
                getLabelColumns = data;
            }
        });
    }


    /**
     * Filter column in array
     * @param  array data
     * @return array data
     */
    function unique(list, index) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e[index], result) == -1) result.push(e[index]);
        });
        return result;
    }


    /**
     * load filter by name to input
     * @param  
     * @return 
     */
    function loadFilterByColumn(index) {

        var nameArray = unique(getDataJson, index);
        //Delete Column Khách Hàng
        nameArray.splice($.inArray(nameArray[0], nameArray),1);
        var option;
        $.each(nameArray, function(key, value) {
            if (value) {
                option += '<option value="'+ value +'">'+ value +'</option>';
            }
        });
        $('#filter-by-name').parent().find('.ms-options-wrap').remove();
        $('#filter-by-name').empty().append(option);

        
        $('#filter-by-name[multiple]').multiselect({
            columns: 4,
            placeholder: 'Select value for column'
        });
    }


    /**
     * get Selected Columns 
     * @return {[type]} [description]
     */
    function getSelectedColumns() {
        var selectedColumns = new Array();
        $( "#columns option:selected" ).each(function() {
            selectedColumns.push($( this ).val());
        });

        return selectedColumns;
    }



    /**
     * Define start date and end date
     * @return Array 
     */
    function defineStartAndEndDate(list) {
        var minDate;
        var maxDate;

        $.each(list, function(key, value) {
            if (moment(value[4], 'MM-DD-YY', true).isValid()) {
                if (!minDate && !maxDate) {
                    minDate = value[4];
                    maxDate = value[4];
                }
                if (moment(value[4]).isBefore(minDate)) {
                // if(value[4] < minDate) {
                    minDate = value[4];
                }
                if (moment(value[4]).isAfter(maxDate)) {
                // if(value[4] > maxDate) {
                    maxDate = value[4];
                }
            }
        });

        minDate = moment(minDate,'MM-DD-YY').format('YYYY-MM-DD');
        maxDate = moment(maxDate,'MM-DD-YY').format('YYYY-MM-DD');

        $('.input-daterange').attr('data-start-date',minDate);
        $('#startdate').val(minDate);
        $('.input-daterange').attr('data-end-date',maxDate);
        $('#enddate').val(maxDate);
    }



    /**
     * Load filter by date to input
     * @return 
     */
    function loadFilterByDate() {

        defineStartAndEndDate(getDataJson);

        var startDate = $('.input-daterange').attr('data-start-date');
        var endDate = $('.input-daterange').attr('data-end-date');

        $('.input-daterange input').each(function() {
            $(this).datepicker({
                format: 'yyyy-mm-dd',
                // showOnFocus: true,
                startDate: startDate,
                endDate: endDate,
                todayBtn: "linked"
            });
        });


        // $('#isFilterByDate').on('click', function() {
        //     // var checked = $("#filter-by-date:checked").length;

        //     // if (checked == 0) {
        //     //     $('#filter-by-date').attr('disabled','disabled');
        //     // } else {
        //     //     $('#filter-by-date').removeAttr('disabled');
        //     // }
        //     // console.log('3');
        //     // if ( $('#isFilterByDate').val() == 'check' ) {
        //     //     $('#filter-by-date').attr('disabled','disabled');        
        //     // }
        //     // else {
        //     //     $('#filter-by-date').removeAttr('disabled');
        //     // }   
        //     if ($('#filter-by-date').attr('disabled') !== typeof undefined && $('#filter-by-date').attr('disabled') !== false) {
        //         $('#filter-by-date').attr('disabled','disabled');
        //         alert('1');
        //     } else {
        //         alert('2');
        //         $('#filter-by-date').removeAttr('disabled');
        //     }
        // });
        
    }



    /**
     * Filter Data By Name
     * @param  array data
     * @return array data
     */
    
    // function filterDataByName(list) {
    //     var filteredByName = new Array();
    //     var filters = new Array();
    //     $( "#filter-by-name option:selected" ).each(function() {
    //         filters.push($( this ).val());
    //     });

    //     $.each(getDataJson, function(key, value) {
    //         if($.inArray(value[2], filters) != -1) {
    //             filteredByName.push(value);
    //         }
    //     });
    //     return filteredByName;
    // }




    /**
     * Filter Data by select column
     * @param  array data
     * @return array data
     */
    function filterDataByColumn() {
        var index = new Array();
        var filters = new Array();
        var filteredByName = new Array();
        $( "#filter-by-name option:selected" ).each(function() {
            filters.push($( this ).val());
        });

        $.each(getDataJson, function(key, value) {
            if($.inArray(value[indexOfLabelColumn].toString(), filters) != -1) {
                filteredByName.push(value);
            }
        });

        return filteredByName;
    }


    /**
     * Filter Data By Date
     * @param  array data
     * @return array data
     */
    function filterDataByDate(list) {
        // console.log(list[5]);
        var startdate = $('#startdate').val();
        var enddate = $('#enddate').val();
        // startdate = startdate.replace('/','-');
        // enddate = enddate.replace('/','-');
        // var length = list.length;
        for(var i = 0; i < list.length; i++) {
            var value = list[i];
            var key = i;
            if (value) {
                var dateV = value[indexOfDateColumn];
                var date = moment(dateV,['MM-DD-YY','MM-DD-YY HH:MM:SS HH:mm:ss A']).format('YYYY-MM-DD');
                // console.log('Key: ' + key);
                // console.log('Element: ' + value);
                // console.log(moment(date,'YYYY-MM-DD').isBetween(moment(getDate[0], "YYYY-MM-DD"), moment(getDate[1], "YYYY-MM-DD")));
                if (! moment(date,'YYYY-MM-DD').isBetween(moment(startdate, "YYYY-MM-DD"), moment(enddate, "YYYY-MM-DD")) ) {
                    var piece = list.splice(key,1);
                    // console.log('Element removed: ' + piece);
                    i--;
                }
            } else {
                // console.log(value);
                var piece = list.splice(key,1);
            }
            // console.log('i : ' + i);
        }

        // console.log('------------');
        // $.each(list, function(key, value) {
        //     console.log(value);
        // });
        // console.log(list.length);
        return list;
    }


    /**
     * Get Column For JqPlot Pie Chart
     * @param  array data
     * @return array data
     */
    function calValueForJqPlotPieChart(list) {
        var getColumn = {};
        $.each(list, function(key, value) {
            if (getColumn[value[indexOfLabelColumn]]) {
                var temp = getColumn[value[indexOfLabelColumn]];
                if (jQuery.isNumeric(parseFloat(value[indexOfVariableColumn]))) {
                    temp += parseFloat(temp) + parseFloat(value[indexOfVariableColumn]);
                }
                getColumn[value[indexOfLabelColumn]] = temp;
            } else {
                if (jQuery.isNumeric(parseFloat(value[indexOfVariableColumn]))) {
                    getColumn[value[indexOfLabelColumn]] = parseFloat(value[indexOfVariableColumn]);
                } else {
                    getColumn[value[indexOfLabelColumn]] = 0;
                }
                
            }


            // if (getColumn[value[indexOfColumn]]) {
            //     var temp = getColumn[value[indexOfColumn]];
            //     if (jQuery.isNumeric(parseFloat(value[9])*parseFloat(value[11]))) {
            //         temp += parseFloat(temp) + parseFloat(value[9])*parseFloat(value[11]);
            //     }
            //     getColumn[value[indexOfColumn]] = temp;
            // } else {
            //     if (jQuery.isNumeric(parseFloat(value[9])*parseFloat(value[11]))) {
            //         getColumn[value[indexOfColumn]] = parseFloat(value[9])*parseFloat(value[11]);
            //     } else {
            //         getColumn[value[indexOfColumn]] = 0;
            //     }
                
            // }
        });
        return getColumn;
    }


    /**
     * convert Object to Array for Zooming Chart
     * @param  object
     * @return array
     */
    function convertObjectToArray(data) {
        var arrData = new Array();
        $.each(data, function(key, value) {
            arrData.push(value);
        });

        return arrData;
    }


    /**
     * Get Column For JqPlot Zooming Chart
     * @param  array data
     * @return array data
     */
    function calValueForJqPlotZoomingChart(list) {
        var getColumn = new Array();
        $.each(list, function(key, value) {
                var temp = new Array();
                var date = moment(value[indexOfDateColumn], 'MM-DD-YY').format('MM/DD/YYYY');
                temp.push(date);
                // temp.push(value[indexOfDateColumn]);
                temp.push(value[indexOfVariableColumn]);

                getColumn.push(temp);
        });
        return getColumn;
    }


    /**
     * Zooming Proxy
     * @param  array data
     * @return array data
     */
    function calValueForJqPlotZoomingProxyChart(list) {
        var data = {};
        var i = 1;
        $.each(list, function(key1, value1) {
            var getColumn = new Array();
            var flag = false;
            $.each(data, function(key2, value2) {
                if (value1[indexOfLabelColumn] == key2 ) {
                    var temp = new Array();
                    var date = moment(value1[indexOfDateColumn], 'MM-DD-YY').format('MM/DD/YYYY');
                    // temp.push(i++);
                    temp.push(date.toString());
                    temp.push(value1[indexOfVariableColumn]);
                    
                    getColumn = data[key2]; 
                    getColumn.push(temp);
                    data[key2] = getColumn;

                    flag = true;
                }
            });
            if (!flag) {
                var temp = new Array();
                var date = moment(value1[indexOfDateColumn], 'MM-DD-YY').format('MM/DD/YYYY');
                // temp.push(i++);
                temp.push(date.toString());
                temp.push(value1[indexOfVariableColumn]);
                
                getColumn.push(temp);
                data[value1[indexOfLabelColumn]] = getColumn;
            }
                

        });
        data = convertObjectToArray(data);
        return data;
    }


    /**
     * Table Sum
     * @param  array data
     * @return array data
     */
    function calTableSum(list) {
        var data = {};
        var i = 1;
        $.each(list, function(key1, value1) {
            var getColumn = new Array();
            var flag = false;
            $.each(data, function(key2, value2) {
                if (value1[indexOfLabelColumn] == key2 ) {
                    var temp = new Array();
                    var date = moment(value1[indexOfDateColumn], 'MM-DD-YY').format('MM/DD/YYYY');
                    // temp.push(i++);
                    temp.push(date.toString());
                    temp.push(value1[indexOfVariableColumn]);
                    
                    getColumn = data[key2]; 
                    getColumn.push(temp);
                    data[key2] = getColumn;

                    flag = true;
                }
            });
            if (!flag) {
                var temp = new Array();
                var date = moment(value1[indexOfDateColumn], 'MM-DD-YY').format('MM/DD/YYYY');
                // temp.push(i++);
                temp.push(date.toString());
                temp.push(value1[indexOfVariableColumn]);
                
                getColumn.push(temp);
                data[value1[indexOfLabelColumn]] = getColumn;
            }
                

        });
        // data = convertObjectToArray(data);
        return data;
    }



    /**
     * Convert to Pie Type JqPlot
     * @param  array data
     * @return array data
     */
    function convertToPieTypeJqPlot(convertFilteredData) {
        var converedArray = new Array();
        var temp = new Array();
        $.each(convertFilteredData, function(key, value) {
            temp.push(key.toString(), value);
            converedArray.push(temp);
            temp = [];
        });

        return converedArray;
    }


    /**
     * Convert to Type JqPlot
     * @param  array data
     * @return array data
     */
    function convertToZoomingTypeJqPlot(convertFilteredData) {

        for (var i = 0; i < convertFilteredData.length; i++) {
            var date1 = moment(convertFilteredData[i][0],'MM-DD-YYYY').format('YYYY-MM-DD');
            for (var j = i; j < convertFilteredData.length; j++) {
                if (convertFilteredData[i] && convertFilteredData[j]) {
                    var date2 = moment(convertFilteredData[j][0],'MM-DD-YYYY').format('YYYY-MM-DD');
                    if (moment(date1).isSame(date2)) {
                        var sum = parseFloat(convertFilteredData[i][1]) + parseFloat(convertFilteredData[j][1]);
                        convertFilteredData[i][1] = sum;
                        convertFilteredData.splice(j,1);
                        j--;
                    }
                }
            }

        };


        // for (var i = 0; i < convertFilteredData.length; i++) {
        //     var date1 = moment(convertFilteredData[i][0],'MM-DD-YYYY').format('YYYY-MM-DD');
        //     for (var j = i; j < convertFilteredData.length; j++) {
        //         if (convertFilteredData[i] && convertFilteredData[j]) {
        //             var date2 = moment(convertFilteredData[j][0],'MM-DD-YYYY').format('YYYY-MM-DD');
        //             if (moment(date1).isSame(date2)) {
        //                 var sum = parseFloat(convertFilteredData[i][1]) + parseFloat(convertFilteredData[j][1]);
        //                 convertFilteredData[i][1] = sum;
        //                 convertFilteredData.splice(j,1);
        //             }
        //         }
        //     }

        // };


        // $.each(convertFilteredData, function(key, value) {
        //     var date1 = value[0];
        //     $.each(convertFilteredData, function(key1, value1) {
        //         console.log(value);
        //         console.log(value1);
        //         if (value1 && value) {
        //             var date2 = value1[0];
        //             if (moment(date1).isSame(date2)) {
        //                 console.log(value1);
        //                 // console.log(parseFloat(value[1]) + parseFloat(value1[1]));
        //                 var sum = parseFloat(value[1]) + parseFloat(value1[1]);
        //                 console.log(sum);
        //                 convertFilteredData[key][1] = sum;
        //                 console.log(convertFilteredData[key][1]);
        //                 convertFilteredData.splice(key1,1);
        //             }
        //         }
        //     });
        // });

        // return converedArray;
        // console.log(convertFilteredData.length);
        $.each(convertFilteredData, function(key, value) {
            // console.log(value[0]);
        });
        return convertFilteredData;
    }
    

    /**
     * Running JqPlotPieChart
     * @param  array data
     * @return 
     */
    function callJQPlotPieChart(filteredData) {
        $('#chart').empty();
        var data = new Array();
        data = convertToPieTypeJqPlot(filteredData);
        console.log(filteredData);
        //JqPlot
        if (data.length) {
            jQuery.jqplot.config.enablePlugins = true;
            plot1 = jQuery.jqplot('chart', 
                [data], 
                {
                    title: ' ', 
                    seriesDefaults: {
                        shadow: false, 
                        renderer: jQuery.jqplot.PieRenderer, 
                        rendererOptions: { 
                          startAngle: 180, 
                          sliceMargin: 4, 
                          showDataLabels: true } 
                    }, 
                    legend: { show:true, location: 'w' },
                }
            );
        }
        
    }

    
    /**
     * Running JqPlotZoomingChart
     * @param  array data
     * @return
     */
    function callJqPlotZoomingChart(filteredData) {
        $('#chart').empty();
        if ($('#chart1').length != 0) {
            $('#chart1').remove();
        }
            // console.log(filteredData.length);
        var data = new Array();
        data = convertToZoomingTypeJqPlot(filteredData);
        //JqPlot
        if (data.length) {
            var plot1 = $.jqplot('chart', [filteredData], { 
                title: '', 
                series: [{ 
                    label: '', 
                    neighborThreshold: -1 
                }], 
                axes: { 
                    xaxis: { 
                        renderer:$.jqplot.DateAxisRenderer,
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer, 
                        tickOptions: {
                          angle: -30
                        } 
                    }, 
                    yaxis: {  
                        renderer: $.jqplot.LogAxisRenderer,
                        tickOptions:{ prefix: '$' } 
                    } 
                }, 
                cursor:{
                    show: true, 
                    zoom: true,
                    showTooltip:true,
                    followMouse: true,
                    looseZoom: true
                } 
            });
        }
    }


    /**
     * Running JqPlotZoomingProxyChart
     * @param  array data
     * @return
     */
    function callJqPlotZoomingProxyChart(filteredData) {
        $('#chart').empty();
        if( $('#chart1').length == 0 ) {
            $('#chart').parent().append('<div id="chart1" style="margin-top: 30px; height: 100px; width: 600px; position: relative;"></div>');
        }
        $('#chart1').empty();

        var data = new Array();
        data = convertToZoomingTypeJqPlot(filteredData);
        //JqPlot
        if (data.length) {
            targetPlot = $.jqplot('chart', data, {
            seriesDefaults:{ showMarker: false },
            series:[
              {label:'P In'},
              {label:'P Out', yaxis:'y2axis'},
              {label:'RPM', yaxis:'y3axis'},
            ],
            cursor:{
              show: true,
              zoom:true,
              showTooltip:false
            },
            legend:{
              location:'nw',
              xoffset: 270,
              yoffset: 100
            },
            axesDefaults: { 
              useSeriesColor:true, 
              rendererOptions: {
                alignTicks: true
              } 
            }
               
          }); 
           
          controllerPlot = $.jqplot('chart1', data, {
            seriesDefaults:{ showMarker: false },
            series:[
              {label:'P In'},
              {label:'P Out', yaxis:'y2axis'},
              {label:'RPM', yaxis:'y3axis'},
            ],
            cursor:{
              show: true,
              showTooltip: false,
              zoom:true,
              constrainZoomTo: 'x'
            },
            axesDefaults: { 
              useSeriesColor:true, 
              rendererOptions: {
                alignTicks: true
              } 
            }
          });
           
          $.jqplot.Cursor.zoomProxy(targetPlot, controllerPlot);
             
          $.jqplot._noToImageButton = true;

        }
    }


    function getSumForTableData(data) {
        var sum = 0;

        $.each(data, function(key, value) {
            if ($.isNumeric(value[1])) {
                sum = parseFloat(sum) + parseFloat(value[1]);
            }
        });

        return sum;
    }



    /**
     * Call to generate Table Sum with data
     * @param  data
     * @return
     */
    function callTableSumGenerate(filteredData) {
        var i = 1;
        $.each(filteredData, function(name, ob) {
            var html = '';
            html += '<h3>'+name+'</h3>';
            html += '<table id="table-sum" class="table table-bordered table-sum table-'+i+'" data-name="'+name+'">';
            html += '<tr><td><strong>Name</strong></td>'
            $.each(ob, function(key, value) {
                html+= '<td><strong>'+value[0].toString()+'</strong></td>';
            });
            html += '</tr>';

            html+= '<tr>';
            html+= '<td>'+name+'</td>';
            $.each(ob, function(key, value) {
                html+= '<td>'+value[1].toString()+'</td>';
            });
            html += '</tr>';

            html += '</table>';
            html += '<h4>Sum : '+getSumForTableData(ob)+'</h4>';
            $('#jumbotron').append('<div id="div-table-sum">' + html + '</div>');

            i++;
        });
            
    }


    /**
     * 
     */
    function resetNotification() {
        $('#notification').fadeOut().empty();
    }


    function validateColumns(arrColumns) {
        if (arrColumns.length < 3) {
            resetNotification();
            $('#notification').append('<p>Please select more than 2 columns</p>').fadeIn();
            return false;
        }
        if (arrColumns.length > 3) {
            resetNotification();
            $('#notification').append('<p>Please unselect more than 1 columns. We just need 2 or 3 columns</p>').fadeIn();
            return false;
        }
        var flagValidLabel = false;
        var flagValidDate = false;
        var flagValidValue = false;
        $.each(arrColumns, function(key, value) {
            if(getLabelColumns[value] == 'string') { 
                flagValidLabel = true;
            }
            if(getLabelColumns[value] == 'date') { 
                flagValidDate = true;
            }
            if(getLabelColumns[value] == 'integer' || getLabelColumns[value] == 'double' || getLabelColumns[value] == 'float') { 
                flagValidValue = true;
            }
        });

        if (!flagValidLabel || !flagValidDate || !flagValidValue) {
            resetNotification();
            $('#notification').append('<p>Please select 3 columns (Label Column, Date Column, Value Column) for calculate the chart</p>').fadeIn();
            return false;
        }


        //validate for zooming chart
        if ($('#filter-by-name').val().length > 1 && $('#chart-type').val() == 'zooming') {
            resetNotification();
            $('#notification').append('<p>About Zooming Chart, just only 1 variable of column was selected</p>').fadeIn();
            return false;
        }

        //validate for zooming chart
        if ($('#chart-type').val() == 'table') {
            // resetNotification();
            // $('#notification').append('<p>About Zooming Chart, just only 1 variable of column was selected</p>').fadeIn();
            // return false;
        }

        return true;
    }


    $('#btn-filter').on('click', function() {
        if ( $('#table-sum').length != 0 ) {
            $('#div-table-sum').remove();
        }

        var selectedColumns = getSelectedColumns();
        if (validateColumns(selectedColumns)) {
            resetNotification(); //Delete notification
            var filteredData = filterDataByColumn();
            filteredData = filterDataByDate(filteredData);
            var chartType = $('#chart-type').val();
            switch(chartType) {
                case 'pie': 
                    $('#chart').fadeIn();
                    filteredData = calValueForJqPlotPieChart(filteredData);
                    callJQPlotPieChart(filteredData);
                    break;
                case 'zooming':
                    $('#chart').fadeIn();
                    filteredData = calValueForJqPlotZoomingChart(filteredData);
                    // console.log(filteredData.length);
                    callJqPlotZoomingChart(filteredData);
                    break;
                case 'table':
                    $('#chart').fadeOut();
                    filteredData = calTableSum(filteredData);
                    console.log(filteredData);
                    callTableSumGenerate(filteredData);
            }

        } else {

        }
        

    });

    // $( "#columns" ).change(function() {
    //     alert('aaa');
    // });

    $('#columns').on('change', function() {
        $('#filter-by-name').empty();
        $('#pie1').empty();

        var columns = $('#columns').val();
        // var 
        if (columns) {
            $.each(columns, function(index, value) {
                if(getLabelColumns[value] == 'string') { 
                    var arr = value.split('-');
                    indexOfLabelColumn = arr[0];
                    loadFilterByColumn(indexOfLabelColumn);
                }
                if(getLabelColumns[value] == 'date') { 
                    var arr = value.split('-');
                    indexOfDateColumn = arr[0];
                }
                if(getLabelColumns[value] == 'integer' || getLabelColumns[value] == 'double' || getLabelColumns[value] == 'float') { 
                    var arr = value.split('-');
                    indexOfVariableColumn = arr[0];
                }
            });
        }
    });    





    //----------------------Init-----------------------------------------
    loadJsonData();
    if (!getDataJson) {
        alert('Unload Json file. Please upload Excel file to load json file !');
        return;
    }
    loadLabelColumns();
    loadColumns();
    // loadFilterByName(getDataJson);
    loadFilterByDate();


});
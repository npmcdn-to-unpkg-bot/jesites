var score = 0;  // Set score to 0
var total = 3; //Total number of questions
var point = 10;  //Points per correct answer
var highest = total * point;

//Initializer
function init() {
    //set correct answers
    sessionStorage.setItem('a1','b');
    sessionStorage.setItem('a2','a');
    sessionStorage.setItem('a3','c');
}
$(document).ready (
    function() {

        $('.questionForm').hide();

        //Show first question
        $('#q1').show();

        $('.questionForm #submit').click(
            function() {

                current = $(this).parents('form:first').data('question');
                next = $(this).parents('form:first').data('question')+1;

                //Hide all questions
                $('.questionForm').hide();

                process(current);

                //Show next question
                $('#q'+next).fadeIn(300);

                return false;


            }
        );

    }
);

//Process the answers
function process(n) {

    var submitted = $('input[name=q'+n+']:checked').val();
    if(submitted == sessionStorage.getItem('a'+n)) {
        score = score + point;
    }

    if(n==total) {
        $('#result').html('<h3>Your final score is '+score+' out of '+highest+'</h3><a href="index.html">Take quiz again</a>');

        if(score == highest) {
            $('#result').append('<p>You are an HTML5 master! </p>');
        } else if (score == highest - point || score == highest - 2*point) {
            $('#result').append('<p>Good job! </p>');
        }
    }

    return false;
}

window.addEventListener('load' , init , false);

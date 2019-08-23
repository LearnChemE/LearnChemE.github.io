Please see auto-generated documentation at:

https://mirrorcoloured.gitlab.io/learnchemejs/docs/index.html

# Classes:
## Problem
· consists of at least one Question, along with an Introduction and a Finish
· keeps track of a score thoughout its steps
· can be restarted, losing all progress and regenerating variables
## Question
· consists of at least one QuestionElement
· has a score that is passed to the ProblemController
## QuestionElement
· parent class, implemented as one of:
    · TextElement
    · TextboxElement
    · CanvasElement
## GraphCanvasController
· controller class for graph elements
## Point, Line, Text
· content that is added to GraphCanvasController
## Modal
· handles modals (in-screen popups)
## GraphInfo
· stores information about graph display
## ZCanvas
· container class for multiple stacked canvases
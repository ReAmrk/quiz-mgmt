import React, { Component } from 'react'
    import Downshift from 'downshift';
    import axios from 'axios';

    export default class DownshiftTwo extends Component {
      constructor(props) {
        super(props)
        this.state = {
          questions: []
        }
        this.fetchQuestions = this.fetchQuestions.bind(this)
        this.inputOnChange = this.inputOnChange.bind(this)
      }
      // onChange method for the input field
      inputOnChange(event) {
        if (!event.target.value) {
          return
        }
        this.fetchQuestions(event.target.value)
      }
      // input field for the <Downshift /> component
      downshiftOnChange(selectedQuestion) {
        alert(`your selected question is: ${selectedQuestion.question}`)
      }
      fetchQuestions(question) {
        const questionURL = `http://localhost:8000/api/questions/`;
        axios.get(questionURL, {withCredentials: true}).then(response => {
          this.setState({ questions: response.data })
        })
        console.log(this.state.questions)
      }
      render() {
        return (
          <Downshift onChange={this.downshiftOnChange} itemToString={item => (item ? item.question : '')}>
  {/* pass the downshift props into a callback */}
  {({ selectedItem, getInputProps, getItemProps, highlightedIndex, isOpen, inputValue, getLabelProps }) => (
    <div>
      {/* add a label tag and pass our label text to the getLabelProps function */}
      <label style={{ marginTop: '1rem', display: 'block' }} {...getLabelProps()}>Choose your question</label> <br />
      {/* add an input tag and pass our placeholder text to the getInputProps function. We also have an onChange event listener on the input field */}
      <input {...getInputProps({
        placeholder: "Search questions",
        onChange: this.inputOnChange
      })} />
      {/* if the input element is open, render the div else render nothing */}
      {isOpen ? (
        <div className="downshift-dropdown">
          {/* filter the movies in the state */}
          {this.state.questions.data
            .filter(item => !inputValue || item.question.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0, 10) // return just the first ten. Helps improve performance
            // map the filtered movies and display their title
            .map((item, index) => (
              <div
                className="dropdown-item"
                {...getItemProps({ key: index, index, item })}
                style={{
                  backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                }}>
                {item.question}
              </div>
            ))
          }
        </div>
      ) : null}
    </div>
  )}
</Downshift>
        )
      }
    }
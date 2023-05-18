# 23-React1 201930226 이종섭

대림대학교 컴퓨터정보학부 3학년 1반 리엑트 수업

## GitHub 2023년 5월 11일

## 12장

### 실습 섭씨온도와 화씨온도 표시하기

1. Chapter_12폴더 생성
2. 생성된 폴더에 TemperatureInput.jsx와 Calculator.jsx폴더 생성
3. TemperatureInput.jsx에는 사용자가 입력할 입력 폼을 만듬

##### TemperatureInput.jsx
```js
const scaleName = {
  c: "섭씨",
  f: "화씨",
};

function TemperatureInput(props){
  const handleChange = (e) => {
    props.onTemperatureChange(e.target.value);
  };

  return(
    <fieldset>
      <legend>
        온도를 입력해주세요 (단위: {scaleName[props.scale]});
      </legend>
      <input value={props.temperature} onChange={handleChange}/>
    </fieldset>
  )
}

export default TemperatureInput;
```

4. Calculator.jsx에는 사용자가 입력한 숫자를 변형해줄 함수들과 출력 폼 만듬

##### Calculator.jsx
```js
import React, { useState } from 'react';
import TemperatureInput from "./TemperatureInput";

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
      return <p>물이 끓습니다.</p>;
  }
  return <p>물이 끓지 않습니다.</p>;
}

function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
      return "";
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

function Calculator(props) {
  const [temperature, setTemperature] = useState("");
  const [scale, setScale] = useState("c");

  const handleCelsiusChange = (temperature) => {
      setTemperature(temperature);
      setScale("c");
  };

  const handleFahrenheitChange = (temperature) => {
      setTemperature(temperature);
      setScale("f");
  };

  const celsius =
      scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit =
      scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

  return (
      <div>
          <TemperatureInput
              scale="c"
              temperature={celsius}
              onTemperatureChange={handleCelsiusChange}
          />
          <TemperatureInput
              scale="f"
              temperature={fahrenheit}
              onTemperatureChange={handleFahrenheitChange}
          />
          <BoilingVerdict celsius={parseFloat(celsius)} />
      </div>
  );
}

export default Calculator;
```

5. index.js 변경

##### index.js
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Calculator from './chapter_12/Calculator';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>
);

reportWebVitals();

```

---
## GitHub 2023년 5월 4일

## 10장 리스트와 키

### 10장 리스트와 키란 무엇인가?

- 리스트는 자바스크립트의 변수나 객체를 하나의 변수로 묶어 놓은 배열과 같음
- 키는 각 객체나 아이템을 구분할 수있는 고유한 값을 의미함
- 리액트에서는 배열과 키를 사용하는 반복되는 다수의 엘리먼트를 쉽게 렌더링할 수 있음

### 여러 개의 컴포넌트 렌더링하기

- 예시로 에어비엔비의 화면처럼 같은 컴포넌트를 화면에 반복적으로 나타내야 할 경우 배열에 들어있는 엘리먼트를 map()함수를 이용하여 랜더링 함
- 다음은 numbers 배열에 들어있는 각각의 요소를 map()함수를 이용하여 하나씩 추출하여 2를 곱한 후 doubled라는 배열에 다시 넣는 코드이다

```js
const double = numbers.map((number)=>number*2);
```

- 담은 리액트에서 map()함수를 사용한 예제이다

```js
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number)=>
  <li>{number}</li>
);
```

- 이 코드는 numbers의 요소에 2를 곱하는 대신 <li> 태그를 결합해서 리턴하고 있음
- 리턴된 listItems는 `<ul>`태그와 결합하여 랜더링 됨

```js
ReactDOM.render(
  <ul>
    <li>{1}</li>
    <li>{2}</li>
    <li>{3}</li>
    <li>{4}</li>
    <li>{5}</li>
  </ul>,
  document,getElementById('root')
)
```

### 기본적인 리스트 컴포넌트

- 앞서 작성한 코드를 별도의 컴포넌트로 분리하면 다음과 같음

```js
function NumberList(props){
  const {numbers} = props;

  const listItems = numbers.map((number)=>
    <li>{number}</li>
  );

  return(
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={number} />,
  document.getElementById('root')
);
```

- 이 컴포넌트는 props로 숫자를 numbers로 받아 리스트로 랜더링 함
- 이 코드를 실행하면 "리스트에 아이템에 무조건 키가 있어야함"라는 경고 문구가 나옴
- 경고 문구가 나오는 이유는 각각의 아이템에 key props가 없기 때문


### 리스트의 키에 대해 알아보기

- 리스트에서의 키는 "리스트에서 아이템을 구별하기 위한 고유한 문자열"임
- 이 키는 리스트에서 어떤 아이템이 변경, 추가 또는 제거되었는지 구분하기 위해 사용
- 키는 같은 리스트에 있는 엘리먼트 사이에서만 고유한 값이 되면 됨

### (실습) 출석부 출력하기

1. src/chapter_10 폴더 생성
2. AttendanceBook.jsx라는 이름의 함수형 컴포넌트 생성
3. 앱을 실행하여 정상 동작 하는지 확인
4. 오류 메시지를 확인 후 앞서 확인한 key props에 관한 오류임
5. 다음과 같이 각 학생 객채에 고유한 값을 가진 id를 추가해주고, map()함수의 엘리먼트에 key = {student.id}를 넣어줌

##### index.js
```js
import SignUp from './chapter_10/LandingPage'; // 추가

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LandingPage /> // 변경
  </React.StrictMode>
);
```

##### AttendanceBook.jsx
```js
import React from 'react';

const students = [
  {
    id: 1, // 고유 key가 될 id값
    name : "Inje",
  },
  {
    id: 2,
    name : "Steve",
  },
  {
    id: 3,
    name : "Bill",
  },
  {
    id: 4,
    name : "Jeff",
  },
]

const AttendanceBook = () => {
  return (
    <div>
      {students.map((student) => {
        return <li key={student.id}>{student.name}</li>
      })}
    </div>
  );
};

export default AttendanceBook;
```

### 10장 요약

#### 리스트

- 같은 아이템을 순서대로 모아놓은 것

#### 키

- 각 객체나 아이템을 구분할 수 있는 고유한 값

#### 여러 개의 컴포넌트 랜더링

- 자바스크립트 배열의 map()함수를 사용
  - 배열에 들어있는 각 변수에 어떤 처리를 한 뒤 결과(엘리먼트)를 배열로 만들어서 리턴함
  - map()함수 안에 있는 엘리먼트는 꼭 키가 필요함

#### 리스트의 키

- 리스트에서 아이템을 구분하기 위한 교유한 문자열
- 리스트에서 어떤 아이템이 변경, 추가 또는 제거되었는지 구분하기 위해 사용
- 리액트에서는 키의 값은 같은 리스트에 있는 엘리먼트 사이에서만 고유한 값이면 됨

#### 다양한 키값의 사용법

- 숫자 값을 사용
  - 배열에 중복된 숫자가 들어있다면 키값도 중복되기 때문에 고유해야 한다는 키값의 조건이 충족되지 않음

- id를 사용
  - id의 의미 자체가 고유한 값이므로 키값으로 사용하기 적합
  - id가 있는 경우에는 보통 id값을 키값으로 사용

- 인덱스를 사용
  - 배열에서 아이템의 순서가 바뀔 수 있는 경우에는 키값으로 인덱스를 사용하는 것을 권장하지않음
  - 리액트에서는 키를 명시적으로 넣어 주지 않으면 기본적으로 인덱스의 값을 키값으로 사용

---

## 11장 폼

### 폼이란 무엇인가?

- 폼은 일반적으로 사용자로부터 입력 받기위한 양식에서 많이 사용됨

```js
<form>
  <label>
    이름 :
    <input type="text" name="name" />
  </label>
  <button type="submit">제출</button>
</form>
```

### 제어 컴포넌트

- 제어 컴포넌트는 사용자가 입력한 값에 접근하고 제어할 수 있도록 해주는 컴포넌트임

- 다음 코드는 사용자의 이름을 입력 받는 HTML폼을 리액트 제어 컴포넌트로 만든 것임

```js
function NameForm(props){
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert("입력한 이름 :" + value);
    event.preventDefault();
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>
        이름 :
        <input type = "text" value={value} onChange={handleChange} />
      </label>
      <button type='submit'>제출</button>
    </form>
  )

}

export default NameForm;
```

### textarea 태그

- HTML에서는 `<textarea>`의 children으로 텍스트가 들어가는 형태임

```js
<textarea>
  안녕하세요, 여기에 이렇게 텍스트가 들어가게 됨
</textarea>
```

- 리액트에서는 state를 통해 태그의 value라는 attribute를 변경하여 텍스트를 표시함

```js
function RequestForm(props){
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert("입력한 요청사항 :" + value);
    event.preventDefault();
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>
        이름 :
        <textarea value={value} onChange={handleChange} />
      </label>
      <button type='submit'>제출</button>
    </form>
  )
}

export default RequestForm;
```

### select 태그

- select 태그도 textarea와 동일

```js
<select>
  <option value = "apple">사과</option>
  <option value = "banana">바나나</option>
  <option value = "grape">포도</option>
  <option value = "watermelon">수박</option>
</select>
```

```js
function FruitSelect(props){
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert("선택한 과일 :" + value);
    event.preventDefault();
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>
        과일을 선택하세요 :
        <select value={value} onChange={handleChange}>
          <option value = "apple">사과</option>
          <option value = "banana">바나나</option>
          <option value = "grape">포도</option>
          <option value = "watermelon">수박</option>
        </select>
      </label>
      <button type='submit'>제출</button>
    </form>
  )
}

export default FruitSelect;
```

### File input 태그

- File input 태그는 그 값이 읽기 전용이기 때문에 리액트에서는 비제어 컴포넌트가 됨

```js
<input type = "file" />
```

### 여러 개의 입력 다루기

```js
function Reservation(props){
  const [haveBreakfast, setHaveBreakfast] = useState(true);
  const [numberOfGuest, setNumberOfGuest] = useState(2);

  const handleSubmit = (event) => {
    alert(`아침식사 여부 : ${haveBreakfast}, 방문객 수 ${numberOfGuest}`);
    event.preventDefault();
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>
        아침식사 여부:
        <input
          type = "checkbox"
          checked = {haveBreakfast}
          onChange = {(evnet) => {
            setHaveBreakfast(evnet.target.checked);
          }}
        />
      </label>
      <br />
      <label>
        방문객 수:
        <input
          type = "number"
          value = {numberOfGuest}
          onChange = {(evnet) => {
            setNumberOfGuest(evnet.target.value)
          }}
        />
      </label>
      <button onSubmit = {handleSubmit}>제출</button>
    </form>
  )
}

export default Reservation;
```

### Input Null Value

- 제어 컴포넌트에 value porp을 정해진 값으로 넣으면 코드를 수정하지 않는 한 입력값을 바꿀수 없음
- 만약 value prop은 넣되 자유롭게 입력할 수 있게 만들고 싶다면 값이 undefined 또는 null을 넣어주면 됨

```js
ReactDOM.render(<inpurt value = "jil" />, rootNode);

setTimeout(function(){
  ReactDOM.render(<input value = {null} />, rootNode);
}, 1000);
```

### (실습) 사용자 정보 입력받기

##### index.js
```js
import SignUp from './chapter_11/SignUp'; // 추가

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SignUp /> // 변경
  </React.StrictMode>
);
```

##### SignUp.jsx
```js
import React, { useState } from 'react';

const SignUp = (props) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남자");

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = (e) => {
    alert(`이름 : ${name}, 성별 : ${gender}`);
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        이름 :
        <input
          type="text"
          value={name}
          onChange={handleChangeName}
        />
      </label>
      <br />
      <label>
        성별 :
        <select value={gender} onChange={handleChangeGender}>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
      </label>
      <button type='submit'>제출</button>
    </form>
  );
};

export default SignUp;
```

### 11장 요약

### 폼이란?

- 사용자로부터 입력을 받기 위해 사용하는 약식

### 제어 컴포넌트

- 사용자가 입력한 값에 접근하고 제어할 수 있게 해주는 컴포넌트
- 값이 리액트의 통제를 받는 입력 폼 엘리먼트

### <input type="text">태크

- 한 줄로 텍스트를 입력받기 위한 HTML 태ㅡ
- 리액트에서는 value라는 attribute로 입력된 값을 관리

### <textarea>태그

- 여러 줄에 걸쳐서 텍스트를 입력받기 위한 HTML태그
- 리액트에서는 value라는 attribute로 입력된 값을 관리

### <select>태그

- 드롭다운 목록을 보여주기 위한 HTML태그
- 여러 가지 옵션 중에서 하나 또는 여러 개를 선택할 수 있는 기능을 제공
- 리액트에서는 value라는 attribute로 옵션의 값을 관리

### <input type="file">태그

- 디바이스의 저장 장치로부터 사용자가 하나 또는 여러 갱의 파일을 선택할 수 있게 해주는 HTML태그
- 서버로 파일을 업로드하거나 자바스크립트의 File API를 사용해서 파일을 다룰 때 사용
- 읽기전용이기 때문에 리액트에서는 비제어 컴포넌트가 됨

### 여러 개의 입력 다루기

- 컴포넌트에 여러 개의 state를 각각의 입력에 대해 사용하면 됨
- value prop은 넣되 자유롭게 입력할 수 있게 만들고 싶을 경우, 값이 undefined 또는 null 넣으면 됨

---

## 12장 state 끌어올리기

### shared state

- shared state는 말 그대로 공유된 state를 의미
- 자식 컴포넌트들이 가장 가까운 공통된 컴포넌트의 state를 공유해서 사용하는 것
- shared state는 어떤 컴포넌트의 state에 있는 데이터를 여러 개의 하위 컴포넌트에서 공통적으로 사용하는 경우를 말함

### 하위컴포넌트에서 State 공유하기

##### Calculator.jsx
```js
function BoilingVerdict(props) {
    if (props.celsius >= 100) {
        return <p>물이 끓습니다.</p>;
    }
    return <p>물이 끓지 않습니다.</p>;
}

function toCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return "";
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

function Calculator(props) {
    const [temperature, setTemperature] = useState("");
    const [scale, setScale] = useState("c");

    const handleCelsiusChange = (temperature) => {
        setTemperature(temperature);
        setScale("c");
    };

    const handleFahrenheitChange = (temperature) => {
        setTemperature(temperature);
        setScale("f");
    };

    const celsius =
        scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit =
        scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
        <div>
            <TemperatureInput
                scale="c"
                temperature={celsius}
                onTemperatureChange={handleCelsiusChange}
            />
            <TemperatureInput
                scale="f"
                temperature={fahrenheit}
                onTemperatureChange={handleFahrenheitChange}
            />
            <BoilingVerdict celsius={parseFloat(celsius)} />
        </div>
    );
}

export default Calculator;
```

---

## GitHub 2023년 4월 27일

## 8장 이벤트 핸들링

### 이벤트 처리하기

- DOM에서 클릭 이벤트를 처리하는 예제 코드

```js
<button onclick = "activate()">
  Activate
</button>
```

- React에서 클릭 이벤트 처리하는 예제 코드
  
```js
<button onClick = {activate}>
  Activate
</button>
```

#### 둘의 차이점
1. 이벤트 이름이 onclick에서 onClick으로 변경(Camel case)
2. 전달하려는 함수는 문자열에서 함수 그대로 전달

- 이벤트가 발생했을 때 해당 이벤트를 처리하는 함수를 "이벤트 핸들러(Event Handler)"라고함
- 또는 이벤트가 발생하는 것을 계속 듣고 있다는 의미로 "이벤트 리스너(Event Listener)"라고도 함

### 이벤트 핸들러 추가하는 방법은?

- 버튼을 클릭하면 이벤트 핸들러 함수인 handleClick()함수를 호출 하도록 되오 있음
- bind를 사용하지 않으면 this.handleClick은 글로벌 스코프에서 호출되어, undefined로 사용할 수 없기 때문
- bind를 사용하지 않으려면 화살표 함수를 사용하는 방법도 있음
- 하지만 클래스 컴포넌트는 이제 거의 사용하지 않기 때문에 이 내용은 참고만 하기
  
  ```js
  class Toggle extends React.Componet{
    constructor(props){
      super(props);

      this.state = {isToggleOn: true};

      // callback에서 `this`를 사용하기 위해서는 바인딩을 필수적으로 해야함
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }

    render() {
      return(
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? '켜짐' : '꺼짐'}
        </button>
      );
    }
  }
  ```
- 클래스형을 함수형으로 바꾸면 다음 코드와 같음

```js
function Toggle(props){
  const [isToggleOn, setIsToggleOn] = useState(true);

  // 방법 1. 함수 안에 함수로 정의
  function handleClick(){
    setIsToggleOn((isToggleOn) => !isToggleOn);
  }

  // 방법 2. arrow function을  사용하여 정의
  const handleClick = () => {
    setIsToggleOn((isToggleOn) => !isToggleOn);
  }

  return(
    <button onClick = {handleClick}>
      {isToggleOn ? "켜짐" : "꺼짐"}
    </button>
  )
}
```

- 함수형에서 이벤트 핸들러를 정의하는 방법은 두 가지 임
- 함수형에서는 this를 사용하지않고 onClick에서 바로 HandleClick을 넘기면 됨

### Arguments 전달하기

- 함수를 정의할 떄는 파라미터(Parameter) 혹은 매개변수, 함수를 사용할 때는 아규먼트(Argument) 혹은 인자라고 부름
- 이벤트 핸들러에 매개변수를 전달해야 하는 경우도 많음

```js
<button onClick = {(event) => this.deleteItem(id, event)}>삭제하기</button>
<button onClick = {this.deleteItem.bind(this, id)}>삭제하기</button>
```

- 위의 코드는 모두 동일한 역할을 하지만 하나는 화살표 함수, 다른 하나는 bind를 사용함
- evnet라는 매개변수는 리액트의 이벤트 객체를 의미함
- 두 방법 모두 첫 번째 매개변수는 id이고 두 번째 매개변수로 event가 전달 됨
- 첫 번째 코드는 명시적으로 event를 매개변수로 넣어 주었고, 두 번째 코드는 id이후 두 번째 매개변수로 event가 자동 전달 됨(이 방법은 클래스형에서 사용하는 방법)

### (실습) 클릭 이벤트 처리하기

1. ConfirmButton 컴포넌트 만들기
2. 클래스 필드 문법 사용하기
3. 함수 컴포넌트로 변경하기

#### 클래스 필드
```js
import React from"react";

class ConfirmButton extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      isConfirmed: false,
    };
    
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleConfirm(){
    this.setState((prevState) => ({
      insConfirmed: !preState.isConfirmed,
    }));
  }

  render(){
    return(
      <button
        onClick={this.handleConfirm}
        disabled={this.state.isConfirmed}
      >
        {this.state.isConfirmed ? "확인 됨" : "확인하기"}
      </button>
    )
  }
}
```
#### 함수형 컴포넌트
```js
import React,{useState} from "react";

function ConfirmedButton(props){
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed((prevIsConfirmed) => !prevIsConfirmed);
  };

  return(
    <button
      onClick = {handleConfirm}
      disabled = {isConfirmed}
    >
      {isConfirmed ? "확인 됨" : "확인하기"}
    </button>
  )
}
```

### 8장 요약

#### 이벤트란

- 사용자가 버튼을 클릭하는 등의 사건을 의미

#### 이벤트 처리하기

- DOM의 이벤트
  - 이벤트의 이름을 모두 소문자로
  - 이벤트를 처리할 함수를 문자열로 전달
- 리액트의 이벤트
  - 이벤트의 이름을 카멜 표기법으로 표기
  - 이벤트를 처리할 함수를 그대로 전달

- 이벤트 핸들러
  - 이벤트가 발생했을 때 해당 이벤트를 처리하는 함수
  - 이벤트 리스너 라고도 함
  - 클래스 컴포넌트
    - 클래스의 함수로 정의하고 생성자에서 바인딩해서 사용
    - 클래스 필드 문법도 사용가능
  - 함수 컴포넌트
    - 함수 안에 함수로 정의하거나 arrow function을 사용해서 정의

- Arguments 전달하기
  - Arguments란?
    - 함수에 전달할 데이터
    - 파라미터 또는 매개변수라고 부르기로 함
  - 클래스 컴포넌트
    - arrow function을 사용하거나 Function.prototype.bind를 사용해서 전달
  - 함수 컴포넌트
    - 이벤트 핸들러 호출 시 원하는 순서대로 매개변수를 넣어서 사용

---

## 9장 조건부 렌더링

### 조건부 렌더링이란?

- 여기서 조건이란 우리가 알고있는 조건문의 조건임
  
```js
function Greeting(props){
  const isLoggedIn = props.isLoggedIn;
  if(isLoggedIn){
    return <UserGreeting />
  }
  return <GuestGreeting>
}
```

- props로 전달 받은 isLoggedIn이 true이면 <UserGreeting />을, false이면 <GuestGreeting />을 retrun함
- 이와 같은 렌더링을 조건부 렌더링이라고 함

### 엘리먼트 변수

- 렌더링해야 될 컴포넌트를 변수처럼 사용하는 방법이 엘리먼트 변수임
- state에 따라 button 변수에 컴포넌트의 객체를 저장하여 return문에 사용하고 있음

```js
let button;
if(isLoggendIn){
  button = <LogutButton onClick = {handleLogutClick} />;
}else{
  button = <LogutButton onClick = {handleLoginClock} />;
}

return(
  <div>
    <Greeting isLoggedIn = {isLoggedIn} />
    {button}
  </div>
)
```

### 인라인 조건

- 필요한 곳에 조건문을 직접 넣어 사용하는 방법

- 인라인 if
  - if문을 직접 사용하지 않고, 동일한 효과를 내기 위해 &&논리 연산자를 사용
  - && 또는 and연산자로 모든 조건이 참일때만 참이 됨
  - 첫 번째 조건이 거짓이면 두 번쨰 조건은 판단할 필요가 없음
```js
//true && expression -> expression
// false && expression -> false

{unreadMessages.length > 0 &&
  <h2>
    현재 {unreadMessages.length}개의 읽지 않은 메시지가 있습니다.
  </h2>
}
```
| A | B | Result |
| - | - | - |
| T | T | T |
| T | F | F |
| F | T | F |
| F | F | F |

- 인라인 if...else
  - 삼항 연산자를 사용
  - 문자열이나 엘리먼트를 넣어서 사용할 수 있음

```js
function UserStatus(props){
  return(
    <div>
      이 사용자는 현재<b>{props.isLoggedIn ? '로그인' : '로그인하지 않음'}</b> 상태입니다.
    </div>
    <div>
      <Greeting isLoggedIn = {isLoggedIn} />
      {isLoggedIn
        ? <LogoutButton onClick = {handleLogoutClick}>
        : <LoginButton onClick = {handleLoginClick}>
      }
    </div>
  )
}
```

### 컴포넌트 렌더링 막기

- 컴포넌트 렌더링을 하고싶지 않을 때에는 null을 리턴 함

```js
function WarningBanner(propr){
  if(!props.warning){
    return null;
  }

  return(
    <div>
      경고!
    </div>
  )
}
```

### (실습) 로그인 여부를 나타내는 툴바 만들기


#### index.js
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import Accommodate from './chapter_07/Accommodate'; -> import LandingPage from './chapter_09/LandingPage';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Accommodate /> -> <LandingPage />
  </React.StrictMode>
);

reportWebVitals();

```

#### LandingPage.jsx
```js
import React from 'react';
import { useState } from 'react';
import Toolbar from './Toolbar';

function LandingPage(props){
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onClickLogin = () => {
    setIsLoggedIn(true);
  }

  const onClickLogout = () =>{
    setIsLoggedIn(false);
  }

  return (
    <div>
      <Toolbar
        isLoggedIn = {isLoggedIn}
        onClickLogin = {onClickLogin}
        onClickLogout = {onClickLogout}
      />
      <div style={{padding : 16}}>소플과 함께하는 리액트 공부!</div>
    </div>
  );
};

export default LandingPage;
```

#### Toolbar.jsx
```js
import React from 'react';

const styles = {
  wrapper : {
    padding : 16,
    display : "flex",
    flexDirection: "row",
    borderBottom: "1px solid grey",
  },
  greeting: {
    marginRight: 8,
  },
}

const Toolbar = (props) => {
  const {isLoggedIn, onClickLogin, onClickLogout} = props;

  return (
    <div style={styles.wrapper}>
      {isLoggedIn && <span style={styles.greeting}>환영합니다!</span>}
      {isLoggedIn ? (
        <button onClick={onClickLogout}>로그아웃</button>
      ) : (
        <button onClick={onClickLogin}>로그인</button>
      )}
    </div>
  );
};

export default Toolbar;
```

### 9장 요약

- 조건부 렌더링
  - 조건에 따라 렌더링 결과가 달리지도록 하는 것

- 엘리먼트 변수
  - 리액트 엘리먼트를 변수처럼 저장해서 사용하는 방법

- 인라인 조건
  - 조건문을 코드 안에 집어넣는 것
  - 인라인 if
    - if문을 필요한 곳에 직접 집어넣어서 사용하는 방법
    - 논리 연산자 &&를 사용(AND 연산)
    - 앞에 나오는 조건문이 true일 경우에만 뒤에 나오는 엘리먼트를 렌더링
  - 인라인 if...else
    - if...else문을 필요한 곳에 직접 집어 넣어서 사용하는 방법
    - 삼항 연산자 ?를 사용
    - 앞에 나오는 조건문이 true면 첫 번째 항목을 리턴, false면 두 번째 항목을 리턴
    - 조건에 따라 각기 다른 엘리먼트를 렌더링하고 싶을 때 사용

- 컴포넌트 렌더링 막기 
  - 리액트에서 null을 리턴하면 렌더링되지 않음
  - 특정 컴포넌트를 렌더링하고 싶지 않을 경우 null을 리턴하면 됨
---
## 10장 리스트와 키란 무엇인가

### 리스트

- 리스트는 우리말로 목록이라 뜻을 가짐
- 컴퓨터 프로그래밍에서는 같은 아이템을 순서대로 모아놓은 것이 해당 됨
- 리스트를 위해 사용하는 자료구조를 배열(Array)임
- 배열은 자바스크립트의 변수나 객체를 하나의 변수를 묶어놓은 것

### 키

- 프로그래밍에서 key는 각 객체나 아이템을 구분할 수 있는 고유값을 의미
## GitHub 2023년 4월 13일
### 6장 요약

### State

#### State란?
- 리액트 컴포넌트의 변경 가능한 데이터
- 컴포넌트를 개발하는 개발자가 직접 정의해서 사용
- State가 변경될 경우 컴포넌트가 재랜더링 됨
- 랜더링이나 데이터 흐름에 사용되는 값만 state에 포함시켜야 함

### State의 특징

- 자바스크림트의 객체 형태로 존재
- 직접적인 변경이 불가능 함
- 클래스 컴포넌트
  - 생성자에서 모든 state를 한번에 정의
  - State를 변경하고자할 때에는 꼭 setState()함수를 사용
- 함수 컴포넌트
  - useState()훅을 사용하여 각각의 state를 정의
  - 각 state별로 주어지는 set함수를 사용하여 state값을 변경
---

## Hook

### 훅이란 무엇인가

- 클래스형 컴포넌트에서는 생성자(construtor)에서 state를 정의하고 setState()함수를 통해 state를 업데이트 함
- 예전에 사용하던 함수형 컴포넌트는 별도로 state를 정의하거나 컴포넌트의 생명주기에 맞춰서 어떤 코드가 실행되도록 할 수 없음
- 함수형 컴포넌트에서도 state나 생명중기 함수의 기능을 사용하게 해주기 위해 추가된 기능이 바로 훅(Hook)임
- 함수형 컴포넌트도 훅을 사용하여 클래스형 컴포넌트의 기능을 모두 동일하게 구현할 수 있게 되어있음
- Hook이란 'state와 생명주기 기능에 갈고리를 걸어 원하는 시점에 정해진 함수를 실행되도록 만든 함수'를 의미함
- 훅의 이름은 모두'use'로 시작함
- 사용자 정의 훅(custom hook)을 만들 수 있으며 이 경우에 이름을 자유롭게 할 수 있으나 'use'로 시작할 것을 권장함

### useState

- useState는 함수형 컴포넌트에서 state를 사용하기 위한 Hook임
- 다음 예제는 버튼을 클릭할 때마다 카운트가 증가한느 함수형 컴포넌트임
- 하지만 증가는 시킬 수 있지만 증가할 때마다 재 렌더링은 일어나지 않음
- 이럴 때 state를 사용해야 하지만 함수형에는 없기때문에 useState()를 사용


### useEffect

- useState와 함께 많이 사용하는 Hook임
- 이 함수는 사이드 이펙트를 수행하기 위한 것임
- 영어로는 side effect는 부작용을 의미
- 일반적으로 프로그래밍에서 사이드 이펙트는 개발자가 의도하지않은 코드가 실행되면서 버그가 발생하는 것을 말함
- 하지만 리액트에서는 효과 혹은 영향을 뜻하는 effect의 의미에 가까움
- 예를 들면 서버에서 데이터를 받아오거나 수동으로 DOM을 변경하는 등의 작업을 의미함
- 이 작업을 이펙트라고 부르는 이유는 이 작업들이 다른 컴포넌트에 영향을 미칠 수 있으며 렌더링중에는 작업이 완료될 수 없기 때문임
- 렌더링이 끝난 이후에는 실행되어야 하는 작업들임
- 클래스 컴포넌트의 생명주기 함수와 같은 기능을 하나로 통합한 기능을 제공함
- 저자는 useEffect가 side effect가 아니라 effet에 가깝다고 설명하고 있짜만 이것은 부작용의 의미를 잘못 해석해서 생긴 오해이다.
- 결국 sideEffect는 렌더링 외에 실행해야하는 부수적인 코드를 말함
- 예를 들면 네트워크 리퀘스트, DOM수동조작, 로깅 등은 정리(clean-up)가 필요없는 경우들임
- useEffect()함수는 다음과 같이 사용함
- 첫 번째 파라미터는 이펙트 함수가 들어아고 두 번째 파라미터로는 의존성 배열이 들어감

```js
function UserStatus(props){
  const isOnline = useSuerStatus(props.uer.id);

  if(isOnline === null){
    return "대기중...";
  }
  return isOnline ? "온라인":"오프라인";
}

function userListItem(props){
  return (
    <li style = {{color : isOnline ? "green" : "black"}}>{props.user.name}</li>
  )
}
```

## GitHub 2023년 4월 06일

#### 컴포넌트 기반 구조

- 작은 컴포넌트들이 모여서 하나의 컴포넌트를 구성하고 이러한 컴포넌트들이 모여서 전체 페이지를 구성

#### 개념적으로 자바스크립트의 함수와 비슷함

- 속성들을 입력으로 받아서 그에 맞는 리액트 엘리먼트를 생성하여 리턴함

### Props

#### Props의 개념

- 래액트 컴포넌트의 속성
- 컴포넌트에 전달할 다양한 정보를 담고 있는 자바스크립트 객체

#### Props의 특징

- 읽기 전용
- 리액트 컴포넌트의 props는 바꿀 소 없고 같은 props가 들어오면 항상 같은 엘리먼트를 리턴해야 함

#### Props 사용법

- JSX를 사용할 경우 컴포넌트에 키-값 쌍으로 형태로 넣어주면 됨
- 문자열 이외에 정수, 변수, 그리고 다른 컴포넌트 등이 들어갈 경우 중괄호를 사용해서 감싸주어야 함
- JSX를 사용하지 않는 경우 createElement() 함수의 두 번째 파라미터로 자바스크립트 객체를 넣어주면 됨
- ***

## state와 생명주기

### state란?

- state는 리액트 컴포넌트의 상태를 의미함
- 상태의 의미는 정상인지 비정상인지가 아니라 컴포넌트의 데이터를 의미함
- 정확히는 컴포넌트의 변경가능한 데이터를 의미함
- State가 변하면 다시 렌더링 되기 떄문에 렌더링과 관련된 값만 state에 포함시켜야 함

### State의 특징

- 리액트만의 특별한 형태가 아닌 단지 자바스크립트 객체일 뿐임
- 예의 LikeButton은 class컴포넌트임
- constructor는 생성자이고 그 안에 있는 this.state가 현 컴포넌트의 state임
- 함수형에서는 useState()라는 함수 사용

### 생명주기에 대해 알아보기

- 생명주기는 컴포넌트의 생성 시점, 사용 시점, 종료 시점을 나타내는 것임
- constuctor가 실행되면서 컴포넌트가 생성됨
- 생성 직후 conponentDidMount()함수가 호출 됨
- 컴포넌가 소멸하기 전까지 여러 번 랜더링 함
- 랜더림은 rpops, setState(), forceUpdate()에 의해 상태가 변경되면 이루어짐
- 그리고 랜더링이 끝나면 componentDinUpdate()함수가 호출됨
- 마지막으로 컴포넌트가 언마운트 되면 conpomentWillUnmount()함수가 호출됨

### state와 생명주기 함수 사용하기

- state 사용하기 - 실습3의 생명주기 함수 사용해보기 코드와 함께 작성 되었음
- /src.chaper_06이라는 이름으로 폴더 생성
- 만든 폴더에 Notification.jsx라는 파일을 만들고 아래 코드처럼 클래스 컴포넌트를 만듬

### React Developer Tools 설치하기

1. 크롬 웹스토어에 React Developer Tools로 검색하면 찾을 수 있음
2. 크롬에 추가 버튼을 클릭해서 설치함
3. 설치 후 크롬 창 새로고침 후 개발자 도구(F12)를 열기
4. 메모리 옆 >>을 눌러 잘 설치 되었는지 확인

## GitHub 2023년 3월 30일

## 엘리먼트 렌더링

### 엘리먼트에 대해 알아보자

### 1. 엘리먼트의 정의

- 엘리먼트는 리액트 앱을 구성하는 요소를 의미
- 공식페이지에는 엘리먼트는 리랙트 앱의 가장 작은 빌딩 블록들 이라고 설명함
- 웹 사이트의 경우 DOM 엘리먼트이며 HTML요소를 의미함

#### 그렇다면 엘리먼트와 DOM엘리먼트는 어떤 차이가 있을까?

- 리액트 엘리먼트는 Virtual DOM의 형태를 취하고 있음
- DOM엘리먼트는 페이지의 모든 정보를 갖고있어 무거움
- 반면 리액트 엘리먼트는 변화한 부부만 갖고있어 가벼움

||DOM| Virtual DOM|
|------|---|---|
|업데이트 속도|느리다|빠르다|
|element 업데이트 방식|DOM 전체를 업데이트|변화 부분을 가상 DOM으로 만든 후 DOM과 비교하여 다른 부분만 업데이트|
|메모리|낭비가 심함|효율적|
### 2. 엘리먼트의 생김새

- 리랙트 엘리먼트는 자바스크립트 객체의 형태로 존재
- 컴포넌트(Button등), 속성(color등) 및 내부의 모든 Children을 포함하는 일반 js객체이다
- 이 객체는 마음대로 변경할 수 없는 불변성을 갖고 있음
- 버튼을 나타내기 위한 엘리먼트의 예를 보겠음
- type에는 html태그 이름, props에는 속성을 나타냄

```jsx
{
  type: Button,
  props:{
    clolor: 'green',
    children: "Hello, elemnet!"
  }
}
```
- 내부적으로 자바스크립트 객체를 만드는 역할을 하는 함수가 createElement()임
- 첫 번째 매개변수가 type임. 이 곳에 태그가 들어가면 그대로 표현하고, 만일 리액트 컴포넌트가 들어가면 이 것을 분해해 결국 태그로 만들게 됨
- 두 번째 매개변수인 props는 속성을 나타냄
- 세 번째 매개변수는 children임. 자식 태그라고 이해하면 됨

### 3. 엘리먼트의 특징

- 리액트 엘리먼트의 가장 큰 특징은 불변성
- 즉 한 번 생성된 엘리먼트의 children이나 속성(attributes)을 바꿀 수 없음

#### 만일 내용이 바뀌면 어떻게 해야할까

- 이 때는 컴포넌트를 통해 새로운 엘리먼트를 생성하면 됨
- 그 다음 이전 엘리먼트와 교체를 하는 방법으로 내용을 바꾸는 것임
- 이렇게 교체하는 작업을 하기위해 Virtual DOM을 사용함

---

### 엘리먼트 렌더링하기

#### Root DOM node

- 다음 html코드는 id값이 root인 div 태그로 단순하지만 리액트에 필수로 들어가는 아주 중ㄴ요한 코드임
- 이 div태그 안에 리액트 엘리먼트가 렌더링 되며 이 것을 Root DOM node라고 함

```html
<div id = "root"></div>
```

- 엘리먼트를 렌더링하기 위해서는 다음과 같은 코드가 필요함

```jsx
const elemnt = <h1>안녕, 리액트!</h1>
ReactDOM.render(element, document.getElementById('root'));
```

- 이때 render()함수를 사용하게 됨
- 이 함수의 첫 번째 파라메터 출력할 리액트 엘리먼트이고, 두 번째 파라메터는 출력할 타겟을 나타냄
- 즉 리액트 렌더링의 과정은 Virtual DOM에서 실제 DOM으로 이동하는 과정이라고 할 수 있음
- 결국 1초에 한번씩 element를 새로 만들고 그것을 교체하는 것임
- 다음 코드를 실행하고 크롬 개발자 도구에서 확인해 보면 시간 부분만 업데이트 되는 것을 확인 할 수 있음

---

### 렌더링 된 엘리먼트 업데이트하기

- 다음 코드는 tick()함수를 정의하고 있음
- 이 함수는 현재 시간을 포함한 element를 생성해서 root div에 렌더링해 줌
- 그런데 라인 12에 보면 setInterval()함수를 이용해서 위에서 정의한 tick()를 1초에 한번씩 호출 하고 있음
- 결국 1초에 한번씩 element를 새로 만들고 그것을 교체하는 것임
- 다음 코드를 실행하고 크롬 개발자 도구에서 확인해 보면 시간 부분만 업데이트 되는 것을 확인 할 수 있음

## 컴포넌트

### 컴포넌트에 대해 알아보기

- 2장에서 설명한 바와 같이 리액트는 컴포넌트 기반의 구조를 가짐
- 컴포넌트 구조라는 것은 작은 컴포넌트를 구성하고 다시 이런 컴포넌트들이 모여서 전체 페이지를 구성한다는 것을 의미
- 컴포넌트 재사용이 가능하기 때문에 전체 코드의 양을 줄일 수 있어 개발 시간과 유지 보수 비용도 줄일 수 있음
- 컴포넌트는 자바스크립트 함수와 입력과 출력이 있다는 면에서 유사함
- 다만 입력과 출력은 입력은 Props가 담당하고 출력은 리액트 엘리먼트의 형태로 출력 됨
- 엘리먼트를 필요한 만큼 만들어 사용한다는 면에서는 객체 지향의 개념과 비슷함
---

### Props에 대해서 알아보기

#### 1.Props의 개념

- Props는 prop(property:속성, 특징)의 준말
- 이 props가 바로 컴포넌트의 속성
- 컴포넌트에 어떤 속성, props를 넣느냐에 따라서 속성이 다른 엘리먼Props는 컴포넌트에 전달 할 다양한 정보를 담고 있는 자바스크립트 객체임트가 출력 됨
  
#### 2. Props의 특징

- 읽기전용(변경할 수 없음)
- 속성이 다른 엘리먼트를 생성하려면 새로운 props를 컴포넌트에 전달하면 됨

#### Pure 함수 vs Impure함수

- Pure함수는 인수로 받은 정보가 함수 내부에서도 변하지 않는 함수
- Impure함수는 인수로 받은 정보가 함수 내부에서 변하는 함수

### 컴포넌트 만들기

#### 1. 컴포넌트의 종류

##### 함수형 컴포넌트

##### 클래스형 컴포넌트

#### 4. 컴포넌트 네이밍

- 이름은 항상 대문자로 시작
- 왜냐하면 리액트는 소문자로 시작하는 컴포넌트를 DOM태그로 인식하기 때문 html tag.
- 컴포넌트 파일 이름과 컴포넌트 이름은 같게 함

#### 5. 컴포넌트 렌더링

- 렌더링의 과정은 다음 코드와 같음

### 컴포넌트 합성

- 컴포넌트 합성은 여러 개의 컴포넌트를 합쳐서 하나의 컴포넌트를 만드는 것임
- 리액트에서는 컴포넌트 안에 또 다른 사용할 수 있기 때문에 복잡한 화면을 여러 개의 컴포넌트로 나누어 구현할 수 있음
- 다음 코드에서는 props의 값을 다르게 해서 Welcome컴포넌트를 여러 번 사용함

### 컴포넌트 추출

- 복잡한 컴포넌트를 쪼개서 여러 개의 컴포넌트로 나눌 수 있음
- 큰 컴포넌트에서 일부를 추출해서 새로운 컴포넌트를 만들 것임
- 실무에서는 처음부터 1개의 컴포넌트에 하나의 기능만 사용하도록 설계하는 것이 좋음

## GitHub 2023년 3월 23일
## JSX(Java Script XML)란?

### JSX 소개

- JavaScript를 확장한 문법
- 리액트로 프로젝트를 개발할 때 사용되므로 공식적인 자바스크립트 문법은 아님

### JSX 역할

- 브라우저에서 실행하기 전에 바벨을 사용하여 일반 자바스크립트 형태의 코드로 변환됨

### JSX의 장점

- JSX는 하나의 파일에 자바스크립트와 HTML을 동시에 작성하여 편리함
- 자바스크립트에서 HTML을 작성하듯이 하기 때문에 가독성이 높고 작성하기 쉬움
- Injection Attack이라 불리는 해킹 방법을 방어함으로써 보안에 강함

### Jsx 사용법

- 모든 자바스크립트문법을 지원
- 자바스크립트 문법에 xml과 html을 섞어서 사용
- 아래 코드의 2번 라인처럼 섞어서 사용하는 것
- 만일 html 이나 xml에 자바스크립트 코드를 사용하고 싶으면{}괄호 사용

### JSX에 표현식 포함하기

- JSX 안에 자바스크립트 표현식 을 중괄호로 묶어서 포함시킬 수 있음

```js
function formatName(user) {
  return user.firstName + " " + user.lastName;
}

const user = {
  firstName: "Harper",
  lastName: "Perez",
};

const element = <h1>Hello, {formatName(user)}!</h1>;

ReactDOM.render(element, document.getElementById("root"));
```

### JSX 속성 정의

- 속성에 따옴표를 이용해 문자열 리터럴을 정의할 수 있음

```js
const element = <div tabIndex="0"></div>;
```

- 속성에 중괄호를 이용해 자바스크립트 표현식을 포함시킬 수 있음

```js
const element = <img src={user.avatarUrl}></img>;
```

### JSX 자식 정의

- 만약 태그가 비어있다면, XML 처럼 `/>`를 이용해 닫아주어야 함

```js
const element = <img src={user.avatarUrl} />;
```

- JSX 태그는 자식을 가질 수 있음

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

---

## GitHub 2023년 3월 16일

## 개발 환경 설정하기

### Node.js와 npm 설치하기

1. 구글에 node검색 후 사이트 접속
2. LTS클릭하여 파일 다운로드 후 프로그램 설치
3. 버전 확인(cmd에서 node v-입력)

## React는 무엇인가

- React란 사용자 인터페이스르 만들기 위한 자바스크립트 라이브러리
- 다양한 자바스크립트 UI프레임워크 : Stack Overflow trends

### React 개념 정리

- 복잡한 사이트를 쉽고 빠르게 만들고 관리하기 위해 만들어진 것
- 다른 표현으로 SPA를 쉽고 빠르게 만들 수 있게 해주는 도구라고 생각하면 좋음

### React 장점

- 이 것을 가능하게 하는 것이 바로 Virtual DOM
- DOM(Document Object Model)이란 XML, HTML 문서의 각 항목을 계층으로 표현하여 생성, 변형, 삭제할 수 있도록 돕는 인터페이스이며 W3C의 표준
- Virtual DOM은 DOM 조작이 비효율적인 이유로 속도가 느리기 때문에 고안 된 방법
- DOCM은 동기식 Virtual DOM은 비동기식 방법으로 렌더링 됨
- 브라우저의 동작원리, Geako와는 조금 차이가 있지만 개념은 동일

---

## 컴포넌트 기반 구조

- 리액트의 모든 페이지는 컴포넌트로 구성됨
- 하나의 컴포넌트는 다른 여러 개의 컴포넌트의 조합으로 구성할 수 있음
- 그래서 리액트로 개발을 하다 보면 레고 블록을 조립하는 것처럼 컴포넌트를 조합해서 웹 사이트를 개발하게 됨
- 에어비앤비 사이트의 화면의 컴포넌트 구조, 재사용성이 뛰어남

### 재사용성

- 반복적인 작업을 줄여주기 때문에 생산성을 높여줌
- 유지보수가 용이
- 재사용이 가능 하려면 해당 모듈의 의존성이 없어야 함

### 든든한 지원군

- 메타(구 페이스북)에서 오픈소스 프로젝트로 관리하고 있어 계속 발전하고 있음
- 활발한 지식 공유&커뮤니티

---

## React의 단점

### 방대한 학습량

- 자바스크립트를 공부한 경우 빠르게 학습할 수 있음

### 높은 상태 관리 복잡도

- state, component, life cycle등의 개념이 있지만 그리 어렵지 않음

---

## GitHub 2023년 3월 8일

## Git 설치

1. 구글에 Git 검색 후 설치
2. 설치 후 cmd에 git --version으로 버전 확인

- git config --global user.name “foo”
- git config --global user.email “foo@example.com”

## GitHub에 가입하기

- 구글에 Github를 검색한 후 회원가입

## Git 사용자 설정(GitHub에 등록한 이름과 메일을 사용)

1. Global 사용자 정보 설정 : 시스템 전체에서 사용함
2. 스페이스 가없으면 ""(double quotes)은 사용하지 않아도 됨

- Local 사용자 정보 설정: Global 설정과는 다르게 특정 폴더만 다른 계정을 등록하고 사용할 수있습니다
- 공용 PC인 경우에 비교적 안전하게 사용할 수 있습니다
- 위 Global 명령에서 ‘--global’ 옵션만 제거하면 됩니다

3. 설정 내용은 다음 명령어로 확인 가능

- git config user.name foo
- git config user.email foo@example.com

## 프로젝트 폴더 Git으로 초기화 하기

- 명령은 원하는 폴더로 이동 후 git init명령으로 초기화 할 수 있음

1. VSCode에서 좌측 source control탭에서 Initialize Repository 클릭
2. 폴더에 .git이라는 숨김 폴더 생성 확인

## commit하기

1. Git으로 초기화된 폴더에 파일이 생성되거나 변경되면 Git이 추척을 시작
2. 변한 파일의 숫자 만큼 source control탭에 숫자로 표기 됨
3. source control탭에서 commit하기 원하는 파일을 stage로 이동 후 Mesesage부분에 commit의 제목과 자세한 설명을 작성
4. 그 후 commit버튼을 누르면 commit 완료

## push하기

### 변경된 내용 중 일부만 commit후 push하는 경우

1. 케밥 메뉴에 push를 선택
2. GitHub에 아직 Repository가 없는 경우 안내 창이 나타남
3. Add Remote 버튼을 클릭한 후 원하는 repository를 선택

### 변경된 내용 모두 commit후 push하는 경우

1. 더 이상 커밋할 파일이 없으면 commit버튼이 Publish Branch로 바뀜
2. 이 버튼을 클랙해도 Push됨
3. 현재 작업 폴더와 같은 이름으로 원격에 저장소를 만들어줌
4. private인지 public인지만 선택해 주면 됨

---

## Github VSCODE 연결방법

### Github vscode에서 repository 생성, GITHUB페이지에서 생성

1. 우측 상단에 +기호 를 누른 후 New repository 클릭
2. Repository name를 정한 후 Public, Praivate선택
3. Add a README.file 생성 여부 클릭
4. Create Repository 클릭

### GitHub와의 연동

1. 연동하기 전에 시스템의 기본 브라우저를 이용하여 GitHub에 로그인 해 놓은 것이 좋음
2. VSCode의 status bar왼쪽의 구름 아이콘을 클릭
3. GitHub에 로그인한다는 팝업창이 나타나면 Allow를 클릭
4. 브라우저에 다음과 페이지를 보여주면 Contunue를 클릭
5. 다음과 같은 메시지가 나오면 체크박스를 체크하고 Visual Studio Code열기를 클릭
6. 크롬의 경우 VSC가 열리고 파이어폭스의 경우에는 응용프로그램을 선택하는 화면 다음에 VSC를 선택하는 화면이 나옴
7. VSCode가 열리면서 메시지가 나오면 Open을 클릭
8. VSCode상단에 보면 2가지의 저장소 중 선택하라는 메시지가 나옴
9. 이는 GitHub에 생성할 저장소를 private를 할지 public으로 할지를 물어본다(private는 본인 이외에는 볼 수가 없으며, public일 경우 소스가 오픈됨)
10. 저장소를 선택하면 계속해서 앞서 연습하던 test폴더를 GitHub에 자동으로 Push하게 된다
11. GitHub에 로그인 하라는 창이 나타나는데 Sign in with browser를 클릭
12. GitHub에 접속하여 test 저장소가 잘 Pysh 됐는지 확인

### Repository 삭제 방법

1. GitHub.com에서 리포지토리의 기본 페이지로 이동 후 설정 클릭
2. 하단의 Delete this repository 클릭
3. 올바른 리포지토리를 삭제하고 있는지 확인하려면 삭제할 리포지토리의 이름을 입력

### Gitignore 파일 생성 방법

1. https://www.toptal.com/developers/gitignore에 접속 후 사용 언어 검색 후 내용 복사
2. `.gitginore`파일 생성 후 내용 붙여넣기 후 커밋

---

## Clone, fork

### Clone과 Fork의 차이점

- Fork한 작업은 원본 작업의 변화를 알 수 있으며 그 변화를 내 작업에 반영 가능
- Clone한 작어븐 원본 작업의 변화를 알 수 없음

### Clone하는 법

1. Git repository에 들어가 Code를 클릭 후 주소 복사
2. vscode 좌측의 source control탭에서 repository 복제에 주소 붙혀넣기
3. 위치 선택 후 열기

---

## BRANCH

- 새로운 레포지토리를 생성하면 main으로 branch가 생성됨(master일수도 있음)
- 원래는 master였으나 현재는 main으로 변경됨

### Master에서 Main으로 바뀐이유

- 인종차별적 요소나 주종 관계를 담고 있는 용어를 제거하기위해서

---

## 클래스형과 함수형 컴포넌트

### 클래스형

- state, lifeCycle 관련 기능사용 가능하다
- 메모리 자원을 함수형 컴포넌트보다 조금 더 사용한다
- 임의 메서드를 정의할 수 있다

### 함수형

- state, lifeCycle 관련 기능사용 불가능 (Hook을 통해 해결 됨)
- 메모리 자원을 함수형 컴포넌트보다 덜 사용한다
- 컴포넌트 선언이 편하다

### 현재 상황

- React에서는 함수형 컴포넌트를 우선시 한다
- 함수형이 시각적으로도 가독성이 높음
- 최근까지만 해도 클래스형을 우선시 했었다
- 함수형이 클래스보다 후에 나왔기 때문에 더 편한 것은 사실이다
- 과거 클래스 컴포넌트 사용한 프로젝트가 있어 유지보수를 위해서 알아둘 필요가 있다

---

## JSON

### JSON(JavaScript Object Notation)

- JSON은 JavaScript언어에서 시작되었지만 현재는 프로그래밍언어와 관계없이 널리 사용하는 데이터 포맷
- 다른 시스템간 다른 프로그래밍언어간 데이터를 교환하기 좋습니다
- 자바스트립트에서 오브젝트를 선언하는 방법
- Key와 key value로 이루어진 스타일의 자료형

---

## 자바스크립트 연산자

### 연산자

- 연산자란 수나 식을 일정한 규칙에 따라 계산하는 것을 의미
- 프로그래밍에서 쓰이는 기호들
- 자바스크립트에는 여러 연산자가 있음

---

## 자바스크립트 함수

### 함수(function)

- 함수란 JavaScript에서 기본 구성 요소 중하나
- JavaScript의 함수는 작업을 수행하거나 값을 계산하는 명령문의 집합이며 반드시 입력을 받아야하고 입력과 명확한 관계가 있는 출력을 반환해야함
- 자바스크립트에서 함수의 정의는 function 키워드로 시작된다
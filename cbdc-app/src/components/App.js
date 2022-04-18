import logo from './logo.svg';
import { Tabs, Tab } from 'react-bootstrap'
import React, {Component } from "react";
import Web3 from 'web3';
//import moment from 'moment';

import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
    document.title = "Mint NFT"
  }

    componentDidMount() {
      this.interval = setInterval(() => { 
      var year = 0;
      var month = 0;
      var day = 0;
      var hour = 0;
      var minute = 0;
      var second = 0;

      var date1 = new Date();
      var date2 = new Date(this.state.years, this.state.months, this.state.days, this.state.hours, this.state.minutes, this.state.seconds);
      const diff = new Date(date2.getTime() - date1.getTime());

      year = diff.getUTCFullYear() - 1970;
      month = diff.getUTCMonth();
      day = diff.getUTCDate() - 1;
      hour = diff.getUTCHours();
      minute = diff.getUTCMinutes();
      second = diff.getUTCSeconds();

      
      this.setState({ year, month, day, hour, minute, second});
      //console.log(diff.getUTCDate())
      //console.log(date1.getUTCDate())

    }, 1000);
  }
   
        /*year = date2.getUTCFullYear() - date1.getUTCFullYear();
        month = date2.getUTCMonth() - date1.getUTCMonth();
        day = date2.getUTCDate() - date1.getUTCDate();
        hour = (date2.getUTCHours() - date1.getUTCHours()) -1;
        minute = (date2.getUTCMinutes() - date1.getUTCMinutes());
        second = (date2.getUTCSeconds() - date1.getUTCSeconds());*/

        /*if(date1.getTime() < date2.getTime()){
  
          if(hour <= 0 && minute <= 0 && second <= 1){
            hour = hour + 23;
            minute = minute + 60;
            day = day - 1;
          }
  
  
          if (minute > 0){
            minute = minute - 1;
          } else {
            minute = 59 + minute;
            hour = hour - 1;
          }
  
          second = 59 + second;
            
        } else {
          year = 0;
          month = 0;
          day = 0;
          hour = 0;
          minute = 0;
          second = 0;
        }*/


    /*this.interval = setInterval(() => {   

      var timeTillDate="20, 02:08:00 pm"
      var timeFormat="DD, hh:mm:ss a'"

      const then = moment(timeTillDate, timeFormat);
      const now = moment()

      if(now.isBefore(then) === true){

        var days = (then.format('DD') - now.format('DD')); 
        var hours = (then.format('hh') - now.format('hh'));
        var minutes = (then.format('mm') - now.format('mm'));
        var seconds = (then.format('ss') - now.format('ss'));

        
        console.log(then.format("hh, a'"))
        console.log(now.format("hh, a'"))

        if ((then.format('hh') - now.format('hh')) === 0 && (then.format('mm') - now.format('mm')) === 0 && (then.format('ss') - now.format('ss')) === 0) {
          hours = 23 + (then.format('hh') - now.format('hh'));
          minutes = 59 + (then.format('mm') - now.format('mm'));
          days = days - 1;
        }

        if(hours <= 0 && minutes <= 0 && seconds <= 1){
          hours = hours + 23;
          minutes = minutes + 60;
          days = days - 1;
        }


        if (minutes > 0){
          minutes = minutes - 1;
        } else {
          minutes = 59 + minutes;
          hours = hours - 1;
        }

        seconds = 59 + seconds;
          
      } else {
        days = 0;
        hours = 0;
        minutes = 0;
        seconds = 0;
      }  

      this.setState({ days, hours, minutes, seconds });
    }, 1000);  
  }*/

  async loadBlockchainData(dispatch) {
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      window.ethereum.enable();
      //const netId = await web3.eth.net.getId()
      var accounts = await web3.eth.getAccounts()
      this.setState({web3: web3});

      window.ethereum.on('accountsChanged', (accounts)=> {
        try{
          if(typeof accounts !=='undefined'){
            console.log(accounts)
            const balance = web3.eth.getBalance(accounts[0])
            this.setState({account: accounts[0], balance: balance})
            
          } else {
            window.alert('Please login with MetaMask')
          }
        }
        catch(e){    
        }
      });

      window.ethereum.on('networkChanged', (networkId)=>{
        console.log('networkChanged',networkId);
        try {
          window.location.reload()
          
        } catch (e) {
          console.log('Error', e)
          window.alert('Contracts not deployed to the current network')
        }
      });

      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
        // console.log(this.state.account)
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts

    } else {
      window.alert('Please install MetaMask')
    }   
  }

  async countdown(years, months, days, hours, minutes, seconds){
    if(this.state.dApps!=='undefined'){
      
      try{       
     
        this.setState({ years, months, days, hours, minutes, seconds});
   
      } catch (e) {
        console.log('Error', e)
      }
    }
  }
  
  async pinata(){   
      const pinataApiKey = "5b4324fda5106b24845f";
      const pinataSecretApiKey = "446cc7cb18e03f24097bf3fa3e20aa1a2dd23630df3e41a476b344ed8d5cc871";
      const axios = require("axios");
      const FormData = require("form-data");

      const pinFileToIPFS = async () => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append("file", this.state.selectedFile);
        
        const res = await axios.post(url, data, {
          maxContentLength: "Infinity", 
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: pinataApiKey, 
            pinata_secret_api_key: pinataSecretApiKey,
          },
        });   
        
        this.state.ipfshash = res.data.IpfsHash;

        console.log(res.data);
        console.log(res.data.IpfsHash);
      };
      pinFileToIPFS();  
    } 

    async pinata2(){  
      const pinataApiKey = "5b4324fda5106b24845f";
      const pinataSecretApiKey = "446cc7cb18e03f24097bf3fa3e20aa1a2dd23630df3e41a476b344ed8d5cc871";
      const axios = require("axios");

      const pinJSONToIPFS = async() => {  

        const metadata = {
          pinataMetadata: {
            name: 'TestArt',
            keyvalues: {
                ItemID: 'Item001',
                CheckpointID: 'Checkpoint001',
                Source: 'CompanyA',
                WeightInKilos: 5.25
            }
          },
          pinataContent: {
            "name": "Test Art",
            "hash": "https://ipfs.io/ipfs/" + this.state.ipfshash, 
            "by": "Kevin Thamrin"
          }
        }

        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        
        const res = await axios.post(url, metadata, {
          headers: {
            
              pinata_api_key: pinataApiKey, 
              pinata_secret_api_key: pinataSecretApiKey,
          },
          body: JSON.stringify(metadata)
        });

        console.log(res.data.IpfsHash);

        this.state.ipfshash2 = res.data.IpfsHash;
      }
      pinJSONToIPFS();  
    } 
              
          /*const res = fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  pinata_api_key: pinataApiKey,
                  pinata_secret_api_key: pinataSecretApiKey
              },
              body: JSON.stringify(metadata)
          });
          console.log(res.IpfsHash)
      }
      pinJSONToIPFS();  
    } */
 
      /*const pinataApiKey = "5b4324fda5106b24845f";
      const pinataSecretApiKey = "446cc7cb18e03f24097bf3fa3e20aa1a2dd23630df3e41a476b344ed8d5cc871";
      const axios = require("axios");
      const FormData = require("form-data");

      const pinJSONToIPFS = async () => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        let data = new FormData();

        this.state.metadata = JSON.stringify({   
          "name": "Test Art",
          "hash": "https://ipfs.io/ipfs/QmZf5PKAh9QbxL8v66mbpmSvYZNXnHuqWTsGEGffHV17W9", 
          "by": "Kevin Thamrin"
       });
       var metadata = this.state.metadata;
        console.log(this.state.metadata);

        data.append('file', metadata);
        const res = await axios.post(url, data, {
            maxContentLength: "Infinity", 
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
              pinata_api_key: pinataApiKey, 
              pinata_secret_api_key: pinataSecretApiKey,
            },
          })
  
        console.log(res.data.IpfsHash);
        console.log(res.data);
      };
      pinJSONToIPFS();  */
     

//IMAGEUPLOAD
    // On file select (from the pop up)
    onFileChange = event => {
        
      // Update the state
      this.setState({ selectedFile: event.target.files[0] });

    };

    fileData = () => {

      if (this.state.selectedFile) {
        
        return (
          <div>
            <h4>File Details:</h4>
            
            <p>File Name: {this.state.selectedFile.name}</p>      
            <p>File Type: {this.state.selectedFile.type}</p>
            
            <p>
              Last Modified:{" "}
              {this.state.selectedFile.lastModifiedDate.toDateString()}
            </p>

          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h5>Choose before Pressing the Upload button</h5>
          </div>
        );
      }
    };


  constructor(props) {
    super(props)
    this.state = {

      web3: 'undefined',
      account: '',
      dappsAddress: null,
      selectedFile: null,
      years: '0',
      months: '0',
      days: '0',
      hours: '0',
      minutesB: '0',
      seconds: '0',

      }
  
  }

  render() {
    return (
      
    <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div>
          <img src={logo} className="App-logo" alt="logo" height="10"/>     
          <b className="navbar-brand" style={{float: "Middle", lineHeight: "35px"}}>NFT</b>
        </div>
        </nav>
        

        <div className="container-fluid mt-5 text-center">
            <br></br>
              <h1>Welcome to Dapps</h1>
              <h2>Wallet : {this.state.account}</h2>
              <br></br>
              <div className="row">
                  <main role="main" className="d-flex justify-content-center mb-3 text-black">
                      <div className="content mr-auto ml-auto">
                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" >

                          <Tab eventKey="CountDown" title="CountDown">

                          <div>
                              <br></br>
                            Input Date and Time?
                              <form onSubmit={(e) => {
                                e.preventDefault()
                                let years = this.years.value
                                let months = this.months.value - 1
                                let days = this.days.value
                                let hours = this.hours.value 
                                let minutes = this.minutes.value
                                let seconds = this.seconds.value
                                
                                this.countdown(years, months, days, hours, minutes, seconds)
                               
                              }}>
                                <div className='form-group mr-sm-2'>

                                  <label htmlFor="Year" style={{float: "left"}}>Year:</label>
                                  <input
                                    id='Year'
                                    type='number'
                                    ref={(input) => { this.years = input }}
                                    className="form-control form-control-sm"
                                    placeholder='2000..'
                                    required />

                                  <label htmlFor="Month" style={{float: "left"}}>Month (1-12):</label>
                                  <input
                                    id='Month'
                                    type='number'
                                    ref={(input) => { this.months = input }}
                                    className="form-control form-control-sm"
                                    placeholder='1-12..'
                                    required />

                                  <label htmlFor="Day" style={{float: "left"}}>Day (1-31):</label>
                                  <input
                                    id='Day'
                                    type='number'
                                    ref={(input) => { this.days = input }}
                                    className="form-control form-control-sm"
                                    placeholder='1-31..'
                                    required />

                                  <label htmlFor="Hour" style={{float: "left"}}>Hour (0-23):</label>
                                  <input
                                    id='Hour'
                                    type='number'
                                    ref={(input) => { this.hours = input }}
                                    className="form-control form-control-sm"
                                    placeholder='0-23..'
                                    required />
                                    
                                  <label htmlFor="Minute" style={{float: "left"}}>Minute (0-59)</label>
                                  <input
                                    id='Minute'
                                    type='number'
                                    ref={(input) => { this.minutes = input }}
                                    className="form-control form-control-sm"
                                    placeholder='0-59..'
                                    required />

                                  <label htmlFor="Second" style={{float: "left"}}>Second (0-59):</label>
                                  <input
                                    id='Second'
                                    type='number'
                                    ref={(input) => { this.seconds = input }}
                                    className="form-control form-control-sm"
                                    placeholder='0-59..'
                                    required />

                                </div>
                                <button type='submit' className='btn btn-primary'>Countdown</button>
                              </form>
                            </div>

                            <br></br>
                              <h1>Countdown until{" "} </h1>
                              <div className="countdown-wrapper">
                                  <div className="countdown-item">
                                    {this.state.year}
                                      <span>years</span>
                                  </div>
                                  <div className="countdown-item">
                                    {this.state.month}
                                      <span>months</span>
                                  </div>
                                  <div className="countdown-item">
                                    {this.state.day}
                                      <span>days</span>
                                  </div>
                                </div>

                                <div className="countdown-wrapper">
                                  <div className="countdown-item">
                                    {this.state.hour}
                                      <span>hours</span>
                                  </div>
                                  <div className="countdown-item">
                                    {this.state.minute}
                                      <span>minutes</span>
                                  </div>
                                  <div className="countdown-item">
                                    {this.state.second}
                                      <span>seconds</span>
                                  </div>
                                </div>
                          </Tab>

                          <Tab eventKey="NFT Mint" title="NFT Mint">

                          <div>

                          <form onSubmit={(e) => {
                                e.preventDefault()
                                this.pinata()
                              }}>
                                <div className='form-group mr-sm-2'>
                                <br></br> 
                                  

                                  <label htmlFor="Name" style={{float: "left"}}>Name:</label> 
                                  <input
                                    id='Transferaddress' 
                                    type='text'
                                    ref={(input) => { this.Transferaddress = input }}
                                    className="form-control form-control-md"
                                    placeholder='Name..'
                                     />

                                  <label htmlFor="Strength" style={{float: "left"}}>Strength:</label>
                                  <input
                                    id='TransferAmount'
                                    step="0.01"
                                    type='number'
                                    ref={(input) => { this.TransferAmount = input }}
                                    className="form-control form-control-md"
                                    placeholder='0'
                                     />                
                                  
                                </div>
                                <div>
                                  <br></br>
                                      <h4>
                                        Image Upload 
                                      </h4>
                                      <div>
                                          <input type="file" onChange={this.onFileChange} />
                                      </div>
                                    {this.fileData()}
                                </div>
                                <button type='submit' className='btn btn-primary'>Upload</button>
                                
                              </form>

                                <br></br>

                            <form onSubmit={(e) => {
                                e.preventDefault()
                                this.pinata2()
                              }}>
                                <div>
                                  <h5>
                                    Wait until hash updated, then press Mint : {this.state.ipfshash}
                                  </h5>   
                                  <br></br>                        
                                  <button type='submit' className='btn btn-primary'>Mint</button>
                                  <br></br>
                                  <br></br>
                                  <h5>
                                    JSON Hash : {this.state.ipfshash2}
                                  </h5>   
                                </div>
                                
                            </form>
                                     
                          </div>

                          </Tab>                     

                        </Tabs>
                        </div>
                   </main>
               </div>
         </div>
     </div>
  ); 
  }
}

export default App;
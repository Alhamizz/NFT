import logo from './logo.svg';
import { Tabs, Tab } from 'react-bootstrap'
import Token from '../abis/Token.json'
import dapps from '../abis/dapps.json'
import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
    await this.loadTokenName()   
    await this.distributedTokens()
    await this.loadmemberslength()

    document.title = "Uang Digital Berbasis Blockchain"
  }

  async loadBlockchainData(dispatch) {
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      window.ethereum.enable();
      const netId = await web3.eth.net.getId()
      var accounts = await web3.eth.getAccounts()
      this.setState({web3: web3});

      window.ethereum.on('accountsChanged', (accounts)=> {
        try{
          if(typeof accounts !=='undefined'){
            console.log(accounts)
            const balance = web3.eth.getBalance(accounts[0])
            this.setState({account: accounts[0], balance: balance})
            this.loadTokenName()
            this.loadmemberslength()
            
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
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dApps = new web3.eth.Contract(dapps.abi, dapps.networks[netId].address)
        const dappsAddress = dapps.networks[netId].address
        const tokenAddress = Token.networks[netId].address
        this.setState({ token: token, dApps: dApps, dappsAddress: dappsAddress, tokenAddress: tokenAddress})

      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }
      

    } else {
      window.alert('Please install MetaMask')
    }   
  }

  async loadTokenName(){
    if(this.state.dApps!=='undefined'){
      try{
        const tokenName = await this.state.token.methods.name().call()
        this.setState({tokenName: tokenName})
      }
      catch (e) {
        console.log('Error, load token name: ', e)
      } 
    }
  }

  async distributedTokens(){
    if(this.state.token!=='undefined'){
      
      try{
        const supplyT = await this.state.token.methods.totalSupply().call();
        this.setState({TokenSupply: supplyT/10**18})
    
      } catch (e) {
        console.log('Error, Supply: ', e);
      }
    }
  }

  async issuance(to, amount){
    if(this.state.dApps!=='undefined'){
      
      try{
        await this.state.dApps.methods.issuance(to, amount.toString()).send({from: this.state.account})
        .on('transactionHash', (hash) => {
          var answer = window.confirm("Redirect to etherscan?")
          if (answer){
            // similar behavior as an HTTP redirect
            window.open("https://ropsten.etherscan.io/tx/" + hash);
         
          }
          
        })
      } catch (e) {
        console.log('Error, issuance: ', e)
      }
    }
  }

  async transfer(to, amount){
    if(this.state.dApps!=='undefined'){
        try{
          await this.state.dApps.methods.transfer(to, amount.toString()).send({from: this.state.account})
          .on('transactionHash', (hash) => {
            var answer = window.confirm("Redirect to etherscan?")
            if (answer){
              // similar behavior as an HTTP redirect
              window.open("https://ropsten.etherscan.io/tx/" + hash);
           
            } 
          })
        } catch (e) {
          console.log('Error, Member not match: ', e)
        }
      }
  }

  
  async loadcountdown(){
    if(this.state.dApps!=='undefined'){
      try{
        // Set the date we're counting down to
        var countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();

        // Update the count down every 1 second
        var x = setInterval(function() {

          // Get today's date and time
          var now = new Date().getTime();

          // Find the distance between now and the count down date
          var distance = countDownDate - now;

          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // Display the result in the element with id="demo"
          let countdown = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

          // If the count down is finished, write some text
          if (distance < 0) {
            clearInterval(x);
            countdown = "EXPIRED";
          }

          this.setState({countdown :countdown})
        }, 1000);
      }
      catch (e) {
        console.log('Error, load members length: ', e)
      } 
    }
  }

  async loadimage(){
    if(this.state.dApps!=='undefined'){
      try{
        const image_input = document.querySelector("#image_input");
        var uploaded_image = "";

        image_input.addEventListener("change", function(){
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            uploaded_image = reader.result;
            document.querySelector("#display_image").style.backgroundImage = 'url(${uploaded_image})';
          })
          reader.readAsDataURL(this.files[0]);
        })
      }
      catch (e) {
        console.log('Error, load members length: ', e)
      } 
    }
  }
 
  constructor(props) {
    super(props)
    this.state = {
      
      Name: [],
      Gender: [],
      Address: [],
      Source: [],
      To: [],
      Amount: [],
      stringA: '',
      stringB: '',
      stringC: '',
      numberD: '',
      web3: 'undefined',
      account: '',
      token: null,
      Dapps: null,
      balance: 0,
      dappsAddress: null,
      tokenName: '',
      memberslength: null,

      }
  
  }

  render() {
    return (

    <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div>
          <img src={logo} className="App-logo" alt="logo" height="10"/>     
          <b className="navbar-brand" style={{float: "Middle", lineHeight: "35px"}}>CBDC</b>
        </div>
        </nav>
        

        <div className="container-fluid mt-5 text-center">
            <br></br>
              <h1>Welcome to Dapps</h1>
              <h2>{this.state.account}</h2>
              <br></br>
              <div className="row">
                  <main role="main" className="d-flex justify-content-center mb-3 text-black">
                      <div className="content mr-auto ml-auto">
                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" >

                          <Tab eventKey="CountDown" title="CountDown">
                            <div>
                              <br></br>

                            <br></br>
                              CountDown...
                              <br></br>

                              <p>
                                {this.state.countdown}
                              </p>
                              

                              <form onSubmit={(e) => {
                                e.preventDefault()
                                let amount = this.IssuanceAmount.value
                                let to = this.Issuanceaddress.value

                                amount = amount * 10**18 //convert to wei
                              
                                this.issuance(to,amount)
                  
    
                              }}>
                                <div className='form-group mr-sm-2'>
                                <br></br>
                                  <label htmlFor="Issuanceaddress" style={{float: "left"}}>Node Address:</label>
                                  <input
                                    id='Issuanceaddress'
                                    type='text'
                                    ref={(input) => { this["Issuanceaddress"] = input }}
                                    className="form-control form-control-md"
                                    placeholder='to...'
                                  required />

                                  <label htmlFor="TypeIssuance" style={{float: "left"}}>Token Issued:</label>
                                  <select name="TypeIssuance" id="TypeIssuance" 
                                    ref={(input) => { this.TypeIssuance = input }} 
                                    className="form-control form-control-md">
                                    <option value="Token">{this.state.tokenName}-({this.state.tokenAddress})</option>
                                  </select>
                                  
                                  <label htmlFor="IssuanceAmount" style={{float: "left"}}>Amount:</label>
                                  <input
                                    id='IssuanceAmount'
                                    step="0.01"
                                    type='number'
                                    ref={(input) => { this.IssuanceAmount = input }}
                                    className="form-control form-control-md"
                                    placeholder='amount...'
                                    required />

                                  
                                </div>
                                <button type='submit' className='btn btn-primary'>Issuance</button>
                              </form>

                            </div>
                          </Tab>
                          <Tab eventKey="NFT Mint" title="NFT Mint">
                            <div>
                            <br></br>
                              NFT Data
                              <br></br>

                              <form onSubmit={(e) => {
                                e.preventDefault()
                                let amount = this.TransferAmount.value
                                let to = this.Transferaddress.value
                                amount = amount * 10**18 //convert to wei
                               
                                this.transfer(to,amount)
  
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
                                    required />

                                  <label htmlFor="Strength" style={{float: "left"}}>Strength:</label>
                                  <input
                                    id='TransferAmount'
                                    step="0.01"
                                    type='number'
                                    ref={(input) => { this.TransferAmount = input }}
                                    className="form-control form-control-md"
                                    placeholder='0'
                                    required />

                                  <label htmlFor="Picture" style={{float: "left"}}>Picture:</label>
                                  <br></br>
                                  <input
                                    type='file'
                                    id="image_input"
                                    accept="Image/png, image/jpg"
                                    required />

                                  <br id="display_image"></br>

                                  <script src="script.js"></script>

                                  
                                </div>
                                <button type='submit' className='btn btn-primary'>Mint</button>
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
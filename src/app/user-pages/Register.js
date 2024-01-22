import React, { useState, useEffect } from 'react';
import { Link, useHistory} from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import endpoint from "../../auth/endpoint"
import {SuccessAlert, ErrorAlert } from "../../toasst/toast"

const Register = () => {
  const [Loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    other_name: '',
    email: '',
    court_id: '',
    password: '',
    confirm_password: '',
    agreeTerms: false,
  });
  const [courtList, setCourtList] = useState([])

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    getCourtList()
  }, [])

  const getCourtList = async() => {
    try {
      const res = await endpoint.get("/court/list")
      console.log("res", res)
      setCourtList(res.data.data)
    } catch (error) {
      console.log("error fetching cause list", error) 
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    console.log("formdata", formData)
      if(formData.password !== formData.confirm_password){
          ErrorAlert("Password does not match")
      }
      try {
        const res = await endpoint.post("/auth/workspace-create", formData)
        if(res.data.status === 200 && res.data.success === true){
          setLoading(false)
          SuccessAlert(res.data.message)
          history.push("/login");
        }
      } catch (error) {
        setLoading(false)
        ErrorAlert(error.response.data.message)
        console.log("error", error)
      }
  };

  return (<>
    {Loading && <div className='text-center'>Loading...</div>}

    {!Loading &&
    <div className="d-flex align-items-center auth px-0">
      <div className="row w-100 mx-0" style={{opacity: 0.9}}>
        <div className="col-lg-8 card shadow">
          <div className="auth-form-light text-left py-5 px-4 px-sm-5">

            <div className="brand-logo text-center">
              <img src={logo} alt="logo" className='mb-2'/>
              <h4>New here? Create Account</h4>
              <h6 className="font-weight-light">And get started with my Case Diary App</h6>
            </div>

            <form className="pt-3" onSubmit={handleSubmit}>
              <div className='row'>
                <div className='form-group col-md-6'>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="last_name"
                    name='last_name'
                    placeholder="Lastname"
                    defaultValue={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className='col-md-6'>
                  <input
                    type="text"
                    id="first_name"
                    name='first_name'
                    className="form-control form-control-lg"
                    placeholder="Firstname"
                    defaultValue={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='row mt-4'>
                <div className='form-group col-md-6'>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="other_name"
                    name='other_name'
                    placeholder="Othername"
                    defaultValue={formData.other_name}
                    onChange={handleChange}
                  />
                </div>
                <div className='form-group col-md-6'>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="email"
                    name='email'
                    placeholder="Email"
                    defaultValue={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <select
                  className="form-control form-select form-control-lg"
                  name='court_id'
                  defaultValue={formData.court_id}
                  onChange={handleChange}
                >
                  <option>Select Court...</option>
                  {courtList && courtList.map((item) => (
                    <option key={item.id} value={item.id}>{item.court_name}</option>
                  ))}

                </select>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="password"
                  name="password"
                  placeholder="Password"
                  defaultValue={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  defaultValue={formData.confirm_password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <div className="form-check">
                  <label className="form-check-label text-muted">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id='agreeTerms'
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                    />
                    <i className="input-helper"></i>
                    I agree to all Terms & Conditions
                  </label>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">
                  SIGN UP
                </button>
              </div>
              <div className="text-center mt-4 font-weight-light">
                Already have an account? <Link to="/login" className="text-primary">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    }
    
    </>);
};

export default Register;

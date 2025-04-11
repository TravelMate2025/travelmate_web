 
import { useState, useEffect } from "react";
import { Checkbox, Divider, FormControlLabel, Modal, Paper, TextField } from "@mui/material";
import master from "../assets/master.svg";
import visa from "../assets/visa.svg";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import "../style/Paymethod.css"
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { useMediaQuery } from "react-responsive";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link } from "react-router-dom";

interface Card {
  name: string;
  cardNumber: string;
  image: string;
}

interface FormErrors {
  cardNumber: boolean;
  cardHolder: boolean;
  expiryDate: boolean;
 
}

const PaymentMethods = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
  const [defaultCardIndex, setDefaultCardIndex] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDefault, setOpenDefault] = useState<boolean>(false);
  const [cardToDeleteIndex, setCardToDeleteIndex] = useState<number | null>(null); 



  const handleDeleteClick = (index: number) => {
    setCardToDeleteIndex(index); 
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSetAsDefault = () => {
    if (currentCardIndex !== null) {
      setDefaultCardIndex(currentCardIndex);
      setOpenDefault(false);
      toast.success("Card Set as Default Successfully");
    }
  };

  const handleOpenDefault = () => {
    setOpenDefault(false);
  };

 const handleOpenAddCard = () => {
    setOpenAddCard(false);
  };

    const [touched, setTouched] = useState<FormErrors>({
  cardNumber: false,
  cardHolder: false,
  expiryDate: false,
});

const [errors, setErrors] = useState<FormErrors>({
  cardNumber: false,
  cardHolder: false,
  expiryDate: false,
});
     
     
     const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       const { name } = e.target;
       setTouched((prev) => ({ ...prev, [name]: true }));
     };
     
  const [cards, setCards] = useState<Card[]>([]);
const [formData, setFormData] = useState({
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
});

const [openAddCard, setOpenAddCard] = useState(false);


  const handleChangePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  setTouched((prev) => ({ ...prev, [name]: true }));
};


     
     const [isFormValid, setIsFormValid] = useState(false);
     
     
useEffect(() => {
  const newErrors = {
    cardNumber: formData.cardNumber.length !== 16,
    cardHolder: formData.cardHolder.trim() === "",
    expiryDate: formData.expiryDate === "",
  };

  setErrors(newErrors);
  setIsFormValid(!Object.values(newErrors).includes(true));
}, [formData]);


  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem("cards", JSON.stringify(cards));
    }
  }, [cards]);

useEffect(() => {
  const storedCards = localStorage.getItem("cards");
  if (storedCards) {
    setCards(JSON.parse(storedCards));
  }
}, []);


   const formatCardNumber = (num: string | number) => {
    return num.toString().replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCardNumberForDisplay = (cardNumber: string) => {
  // Mask all but the last 4 digits
  const masked = cardNumber.slice(0, -4).replace(/\d/g, '*'); // Mask all but last 4 digits
  const lastFour = cardNumber.slice(-4); // Get the last 4 digits
  return masked + lastFour; // Combine masked part with the last 4 digits
};

const handleSaveClick = () => {
  const newCard = {
    name: formData.cardHolder,
    cardNumber: formatCardNumber(formData.cardNumber),
    image: master,
  };

  // Add new card to the list of cards
  setCards((prev) => {
    const updatedCards = [...prev, newCard];

    // If "Save this card for future payment" is checked, set this card as the default
    if (saveCard) {
      setDefaultCardIndex(updatedCards.length - 1); // Set the new card as the default card
    }

    return updatedCards;
  });

  // Success toast
  toast.success("Card Added Successfully");

  // Close the modal and reset the form data
  setOpenModal(false);
  setFormData({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
  });
  setTouched({
    cardNumber: false,
    cardHolder: false,
    expiryDate: false,
  });

  // Open the modal again if needed (optional)
  handleOpenAddCard();
};



const handleDeleteCard = () => {
  if (cardToDeleteIndex !== null) {
    const updatedCards = cards.filter((_, index) => index !== cardToDeleteIndex);
    setCards(updatedCards);

    // Save the updated cards array to localStorage after deletion
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    toast.success("Card Deleted Successfully");
  }
  setOpenModal(false);
};

const [saveCard, setSaveCard] = useState(false);

const isCardFormValid = () => {
  return (
    formData.cardNumber?.toString().length === 16 &&
    formData.cardHolder?.trim().length > 0 &&
    formData.expiryDate?.trim().length > 0
  );
};

useEffect(() => {
  if (!isCardFormValid() && saveCard) {
    setSaveCard(false);
  }
}, [formData]);

  // const [isAddingCard, setIsAddingCard] = useState(false);

 


  return (
    

    <div>
    {isMobile ? (
    

      <div className="">
      <ToastContainer />
 
      {cards.length === 0 ? (

        <div>

                  <div className="mb-6 ">
                          <Link to="/" >
                        <div style={{ position: "absolute", left: "28px", top: "85px" }} className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
                          <ArrowBackIosNewOutlinedIcon className="font-bold " />
                          </div>
                        </Link>
                          <p className="text-center font-semibold text-[20px]  mt-[90px]">Payment Method</p>
                        </div>
  
  <div className="flex flex-col items-center justify-center h-[20rem] rounded-[12px] p-6 mt-[70px]">
   <div className="w-[80px] h-[80px] rounded-full border-[1.47px] mb-[24px]  border-[#DEDFE1] bg-[#F5F5F5] flex items-center justify-center">
  <PaymentOutlinedIcon className="text-[#67696D] text-[1400px]" sx={{fontSize:"50px"}} />
  </div>

    <p className="text-black  mb-[6px] font-semibold text-[20px]">No Payment Method Added</p>
    <p className="text-[#67696D]  mb-[30px] font-normal text-[14px] text-center w-[40%]">Add a payment method to make your future bookings quick and seamless</p>

    <button
      onClick={() => setOpenAddCard(true)}
      className="flex items-center text-[14px] gap-1 text-white border bg-[#023E8A] border-[#023E8A] px-4 py-2 rounded-[8px] cursor-pointer"
    >
      Add New Card
    </button>
  </div>
        </div>
) : (
  
  <>

      <div className="mb-6 ">
                  <Link to="/profile" >
                <div style={{ position: "absolute", left: "28px", top: "85px" }} className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
                  <ArrowBackIosNewOutlinedIcon className="font-bold " />
                  </div>
                </Link>
                  <p className="text-center font-semibold text-[20px]  mt-[90px]">Payment Method</p>
                </div>
    <div className="flex gap-2 justify-between mb-4  w-[95%] m-auto">
      <div className="flex gap-1 mt-2">
        <img src={master} alt="" className="w-[48px] h-[36px]" />
        <img src={visa} alt="" className="w-[48px] h-[36px]" />
      </div>

     
    </div>

    <div className="h-[30rem] overflow-y-auto custom-scroll w-[95%] m-auto">
      <div className="mt-[24px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className="border-1 border-[#CDCED1] bg-white w-full rounded-[12px] pt-[16px] pr-[24px] pl-[24px] mb-4"
          >
            <div className="flex justify-between mb-[20px]">
              <div className="flex gap-2">
                <img src={card.image} alt="" className="w-[48px] h-[36px]" />
                <div>
                  <div className="flex gap-4">
                    <p>{card.name}</p>
                    {defaultCardIndex === index && (
                      <div>
                        <button className="border-1 border-[#FF6F1E] bg-[#FFE2D2] w-[55px] h-[25px] rounded-[4px] text-[#181818] text-[12px]">
                          Default
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[14px] text-[#67696D] mt-1">
                    {formatCardNumberForDisplay(card.cardNumber)}
                  </p>
                </div>
              </div>

              <div
                className="text-[#D72638] h-[24px] cursor-pointer mt-3"
                onClick={() => handleDeleteClick(index)}
              >
                <DeleteOutlineOutlinedIcon />
              </div>
            </div>

            {defaultCardIndex !== index && (
              <div
                onClick={() => {
                  setCurrentCardIndex(index);
                  setOpenDefault(true);
                }}
                className="cursor-pointer"
              >
                <Divider />
                <p className="text-[13px] text-[#023E8A] mt-[10px] cursor-pointer font-medium mb-[10px] ">
                  Set as default
                </p>
              </div>
            )}
          </div>
        ))}

         <div  onClick={() => setOpenAddCard(true)} className="h-[50px] p-6 text-center pt-3 mt-[60px] bg-[#023E8A]  rounded-[8px] cursor-pointer">
        <button
          onClick={() => setOpenAddCard(true)}
          className="text-white cursor-pointer"
        >
          Add New Card
        </button>
      </div>
      </div>
    </div>
  </>
)}


   
  <Modal
  open={openAddCard}
  onClose={handleOpenAddCard}
  BackdropProps={{
    style: {
      display: 'none', 
    },
  }}
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',  // Full width
    height: '100vh', 
    margin: 0,  
    padding: 0,
  }}
>
  <Paper className="p-0 border-[#CDCED1] rounded-[12px] relative  w-full h-full flex flex-col overflow-hidden">
    
  <div className="mb-6 ">
          
              <div onClick={handleOpenAddCard} style={{ position: "absolute", left: "28px", top: "55px" }} className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
                <ArrowBackIosNewOutlinedIcon className="font-bold " />
                </div>
                <p className="text-center font-semibold text-[20px]  mt-[60px]">New Card</p>
              </div>


   
    <div className=" mt-[5rem] w-[90%] m-auto ">
  <div className="flex flex-col mb-[10px]">
    <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Card Number</label>
    <TextField
      name="cardNumber"
      type="number"
      variant="outlined"
      size="small"
      placeholder="1234 5678 9876 0192"
      value={formData.cardNumber}
      onChange={handleChangePayment}
      onBlur={handleBlur}
      error={errors.cardNumber && touched.cardNumber}
      helperText={errors.cardNumber && touched.cardNumber ? "Card number must be 16 digits" : ""}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          border:"1px solid #818489 ",
          height: "44px",
          borderRadius: "8px",
          borderColor: errors.cardNumber && touched.cardNumber ? "red" : "#818489", // Set border color to red if there's an error
        },
      }}
    />
  </div>

  <div className="flex flex-col mb-[10px]">
    <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Cardholder's Name</label>
    <TextField
      name="cardHolder"
      type="text"
      variant="outlined"
      size="small"
      placeholder="Enter Name"
      value={formData.cardHolder}
      onChange={handleChangePayment}
      error={errors.cardHolder && touched.cardHolder}
      helperText={errors.cardHolder && touched.cardHolder ? "Cardholder's name is required" : ""}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          border:"1px solid #818489 ",
          height: "44px",
          borderRadius: "8px",
          borderColor: errors.cardHolder && touched.cardHolder ? "red" : "#818489", // Set border color to red if there's an error
        },
      }}
    />
  </div>

  <div className="flex flex-col mb-[10px]">
    <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Expiry Date</label>
    <TextField
      name="expiryDate"
      type="month"
      variant="outlined"
      size="small"
      value={formData.expiryDate}
      onChange={handleChangePayment}
      error={errors.expiryDate && touched.expiryDate}
      helperText={errors.expiryDate && touched.expiryDate ? "Expiry date is required" : ""}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          border:"1px solid #818489 ",
          height: "44px",
          borderRadius: "8px",
          borderColor: errors.expiryDate && touched.expiryDate ? "red" : "#818489", // Set border color to red if there's an error
        },
      }}
    />
  </div>

  <FormControlLabel 
    control={
      <Checkbox 
        checked={saveCard}
        onChange={(e) => {
          if (isCardFormValid()) {
            setSaveCard(e.target.checked);
          }
        }}
      />
    } 
    label="Save this card for future payment" 
    className='mt-[-10px]'  
  />
   </div>


      
      <div className="flex flex-col-reverse  gap-4  mt-[10px] w-[90%] m-auto">
        <button
          onClick={handleOpenAddCard}
          className="border-1 border-[#023E8A] w-full text-[#023E8A] bg-white p-2 rounded-[8px] h-[50px] cursor-pointer text-[20px] font-medium"
        >
          Cancel
        </button>
        <div className="w-full">
          <button
            onClick={handleSaveClick}
            disabled={!isFormValid}
            className={`p-2 w-full rounded-[8px] h-[50px] text-[20px] font-medium ${
              isFormValid ? 'bg-[#023E8A] text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    

  </Paper>
  </Modal>


      <Modal
        open={openDefault}
        onClose={handleOpenDefault}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius:"12px",
        }}
      >
        <Paper 
        
        sx={{
          p: 4,
          border: '1px solid #CDCED1',
          borderRadius: '12px',
          width: '90%',
          position: 'relative',
        }}>
          <div
            onClick={handleOpenDefault}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[24px] mt-[24px] text-[#181818] mb-[24px]">Set As Default</p>

          <h3 className="text-[18px] w-[100%] m-auto font-normal text-center text-[#67696D]  mb-[30px]">Do you want to set this card as your default payment method? It will be used for all future transactions.</h3>
          <div className="flex gap-4 flex-col-reverse ">
            <button
              onClick={handleOpenDefault}
              className="border-1 border-[#023E8A] w-full text-[#023E8A] bg-white p-2 rounded-[8px] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>
            <div className="w-full">
              {currentCardIndex !== null && (
                <div onClick={handleSetAsDefault} className=" ">
                  <Divider />
                  <button
                    className="bg-[#023E8A] text-white p-2 w-[100%] rounded-[8px]  h-[56px] cursor-pointer text-[20px] font-medium"
                  >
                    Set As Default
                  </button>
                </div>
              )}
            </div>
          </div>
        </Paper>
      </Modal>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
          p: 4,
          border: '1px solid #CDCED1',
          borderRadius: '12px',
          width: '90%',
          position: 'relative',
        }}
        >
          <div
            onClick={handleCloseModal}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[24px] mt-[24px] text-[#181818] mb-[14px]">Delete Card</p>

          <h3 className="text-[18px] w-[90%] m-auto font-normal text-center text-[#67696D]  mb-[30px]">Are you sure you want to delete this card? This action cannot be undone.</h3>
          <div className="flex gap-4 flex-col-reverse">
            <button
              onClick={handleCloseModal}
              className="border-1 border-[#023E8A] text-[#023E8A] bg-white p-2 rounded-[8px] w-full h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteCard}
              className="bg-[#D72638] text-white p-2 rounded-[8px] w-full h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Delete Card
            </button>
          </div>
        </Paper>
      </Modal>
    </div>




   ) : (

    // web view


    <div className="">
      <ToastContainer />
 
      {cards.length === 0 ? (

        <div>
          <div className="flex gap-1">
        <img src={master} alt="" className="w-[48px] h-[36px]" />
        <img src={visa} alt="" className="w-[48px] h-[36px]" />
    
        </div>
  
  <div className="flex flex-col items-center justify-center h-[20rem] rounded-[12px] p-6 mt-[70px]">
   <div className="w-[80px] h-[80px] rounded-full border-[1.47px] mb-[24px]  border-[#DEDFE1] bg-[#F5F5F5] flex items-center justify-center">
  <PaymentOutlinedIcon className="text-[#67696D] text-[1400px]" sx={{fontSize:"50px"}} />
  </div>

    <p className="text-black  mb-[6px] font-semibold text-[20px]">No Payment Method Added</p>
    <p className="text-[#67696D]  mb-[30px] font-normal text-[14px] text-center w-[40%]">Add a payment method to make your future bookings quick and seamless</p>

    <button
      onClick={() => setOpenAddCard(true)}
      className="flex items-center text-[14px] gap-1 text-white border bg-[#023E8A] border-[#023E8A] px-4 py-2 rounded-[8px] cursor-pointer"
    >
      Add New Card
    </button>
  </div>
        </div>
) : (
  
  <>
    <div className="flex gap-2 justify-between mb-4">
      <div className="flex gap-1">
        <img src={master} alt="" className="w-[48px] h-[36px]" />
        <img src={visa} alt="" className="w-[48px] h-[36px]" />
      </div>

      <div className="h-[50px] p-6 text-center pt-3 border-1 bg-white border-[#023E8A] rounded-[8px] cursor-pointer">
        <button
          onClick={() => setOpenAddCard(true)}
          className="text-[#023E8A] cursor-pointer"
        >
          <AddOutlinedIcon /> Add New Card
        </button>
      </div>
    </div>

    <div className="h-[30rem] overflow-y-auto custom-scroll">
      <div className="mt-[24px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className="border-1 border-[#CDCED1] bg-white w-full rounded-[12px] pt-[16px] pr-[24px] pl-[24px] mb-4"
          >
            <div className="flex justify-between mb-[20px]">
              <div className="flex gap-2">
                <img src={card.image} alt="" className="w-[48px] h-[36px]" />
                <div>
                  <div className="flex gap-4">
                    <p>{card.name}</p>
                    {defaultCardIndex === index && (
                      <div>
                        <button className="border-1 border-[#FF6F1E] bg-[#FFE2D2] w-[55px] h-[25px] rounded-[4px] text-[#181818] text-[12px]">
                          Default
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[14px] text-[#67696D] mt-1">
                    {formatCardNumberForDisplay(card.cardNumber)}
                  </p>
                </div>
              </div>

              <div
                className="text-[#D72638] h-[24px] cursor-pointer mt-3"
                onClick={() => handleDeleteClick(index)}
              >
                <DeleteOutlineOutlinedIcon />
              </div>
            </div>

            {defaultCardIndex !== index && (
              <div
                onClick={() => {
                  setCurrentCardIndex(index);
                  setOpenDefault(true);
                }}
                className="cursor-pointer"
              >
                <Divider />
                <p className="text-[13px] text-[#023E8A] mt-[10px] cursor-pointer font-medium mb-[10px] ">
                  Set as default
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </>
)}


   
  <Modal
  open={openAddCard}
  onClose={handleOpenAddCard}
  BackdropProps={{
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  }}
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Paper className="p-0 border-[#CDCED1] rounded-[12px] relative  w-[503px] flex flex-col overflow-hidden">
    
    {/* Top Fixed Header */}
    <div className="sticky top-0 bg-white z-10 p-4">
      <div onClick={handleOpenAddCard} className="flex justify-end">
        <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <p className="font-medium text-center text-[16px] mt-[-24px] text-[#181818] mb-2">Add New Card</p>
      <Divider />
    </div>

    {/* Scrollable Content */}
    <div className=" mt-[10px] w-[90%] m-auto ">
                            
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Card Number</label>
                                            <TextField
                                            name="cardNumber"
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            placeholder="1234 5678 9876 0192"
                                            value={formData.cardNumber}
                                            onChange={handleChangePayment}
                                            onBlur={handleBlur}
                                            error={errors.cardNumber && touched.cardNumber}
                                             helperText={errors.cardNumber && touched.cardNumber ? "Card number must be 16 digits" : ""}
                                             sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cardNumber ? (errors.cardNumber ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Cardholder's Name</label>
                                            <TextField
                                            name="cardHolder"
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Enter Name"
                                            value={formData.cardHolder}
                                            onChange={handleChangePayment}
                                            error={errors.cardHolder && touched.cardHolder}
                                            helperText={errors.cardHolder && touched.cardHolder ? "Cardholder's name is required" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cardHolder ? (errors.cardHolder ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Expiry Date</label>
                                            <TextField
                                            name="expiryDate"
                                              type="month"
                                            variant="outlined"
                                            size="small"
                                            value={formData.expiryDate}
                                            onChange={handleChangePayment}
                                            error={errors.expiryDate && touched.expiryDate}
                                            helperText={errors.expiryDate && touched.expiryDate ? "Expiry date is required" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.expiryDate ? (errors.expiryDate ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        
                
                                      <FormControlLabel 
                                        control={
                                          <Checkbox 
                                            checked={saveCard}
                                            onChange={(e) => {
                                              if (isCardFormValid()) {
                                                setSaveCard(e.target.checked);
                                              }
                                            }}
                                          />
                                        } 
                                        label="Save this card for future payment" 
                                        className='mt-[-10px]'  
                                      />


    </div>

    {/* Bottom Fixed Footer */}
    <div className="sticky bottom-0 bg-white z-10 p-4 ">
      <Divider className="mb-4" />
      <div className="flex gap-4 justify-end mt-[10px]">
        <button
          onClick={handleOpenAddCard}
          className="border-1 border-[#023E8A] w-[99px] text-[#023E8A] bg-white p-2 rounded-[8px] h-[50px] cursor-pointer text-[20px] font-medium"
        >
          Cancel
        </button>
        <div className="w-[79px]">
          <button
            onClick={handleSaveClick}
            disabled={!isFormValid}
            className={`p-2 w-full rounded-[8px] h-[50px] text-[20px] font-medium ${
              isFormValid ? 'bg-[#023E8A] text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>

  </Paper>
      </Modal>


      <Modal
        open={openDefault}
        onClose={handleOpenDefault}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper className="p-4 border-[#CDCED1] rounded-[8px] relative  h-[349px] w-[468px]">
          <div
            onClick={handleOpenDefault}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[24px] mt-[24px] text-[#181818] mb-[24px]">Set As Default</p>

          <h3 className="text-[18px] w-[90%] m-auto font-normal text-center text-[#67696D]  mb-[58px]">Do you want to set this card as your default payment method? It will be used for all future transactions.</h3>
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleOpenDefault}
              className="border-1 border-[#023E8A] w-[50%] text-[#023E8A] bg-white p-2 rounded-[8px] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>
            <div className="w-[50%]">
              {currentCardIndex !== null && (
                <div onClick={handleSetAsDefault} className=" ">
                  <Divider />
                  <button
                    className="bg-[#023E8A] text-white p-2 w-[100%] rounded-[8px]  h-[56px] cursor-pointer text-[20px] font-medium"
                  >
                    Set As Default
                  </button>
                </div>
              )}
            </div>
          </div>
        </Paper>
      </Modal>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper className="p-4 border-1 border-[#CDCED1] rounded-[8px] relative  h-[349px] w-[468px]">
          <div
            onClick={handleCloseModal}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[24px] mt-[24px] text-[#181818] mb-[24px]">Delete Card</p>

          <h3 className="text-[18px] w-[90%] m-auto font-normal text-center text-[#67696D]  mb-[80px]">Are you sure you want to delete this card? This action cannot be undone.</h3>
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleCloseModal}
              className="border-1 border-[#023E8A] text-[#023E8A] bg-white p-2 rounded-[8px] w-[50%] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteCard}
              className="bg-[#D72638] text-white p-2 rounded-[8px] w-[50%] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Delete Card
            </button>
          </div>
        </Paper>
      </Modal>
    </div>
 )}
    </div>
  );
};

export default PaymentMethods;

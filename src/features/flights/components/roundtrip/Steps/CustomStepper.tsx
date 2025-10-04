import { Divider, Typography } from "@mui/material";
type Step = {
  label: string;
};

interface CustomStepperProps {
  steps: Step[];
  activeStep: number;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ steps, activeStep }) => {
  return (
    <div className="flex min-h-[60px] w-full   md:max-w-[634px] bg-white relative z-[1] md:px-8">
      {steps.map((step, i) => {
        const isActive = i <= activeStep;
        const color = isActive ? "#023E8A" : "#878787";
        const borderColor = isActive ? "#023E8A" : "#F0F0F0";

        return (
          <div
            key={i}
            className={`flex   items-center ${i !== 0 ? "flex-1" : ""}`}
          >
            {i !== 0 && <Divider sx={{ flex: 1, borderColor: borderColor, borderWidth:"1.5px" }} />}
            <div
              className={
                "relative flex flex-col items-center  " +
                (i === 0 ? "ml-4" : "") +
                "" +
                (i === steps.length - 1 ? "mr-4" : "")
              }
            >
              <div
                className="size-8 flex text-18px justify-center text-white items-center rounded-full "
                style={{
                  borderColor: color,
                    borderWidth: "1.65px",
                  backgroundColor:color,
                  borderStyle: "solid",
                }}
                    >
                        {i+1}
           
              </div>
              <Typography
                position="absolute"
                bottom="-1.8rem"
                whiteSpace="nowrap"
                // fontSize="20px"
                fontSize={{xs:"10px", md:16}}
                fontWeight={400}
                color={color}
                bgcolor={"white"}
              >
                {step.label}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomStepper;

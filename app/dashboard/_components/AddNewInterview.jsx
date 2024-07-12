"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const InputPromt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, job Experience: ${jobExperience}, Depend on Job Position, Job Description and Job Experience & Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION} Interview question along with Answer in JSON format`;
    const result = await chatSession.sendMessage(InputPromt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    //console.log(JSON.parse(MockJsonResp))
    setJsonResponse(MockJsonResp);
   if(MockJsonResp){
    const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      }).returning({mockId:MockInterview.mockId})
      console.log("Insert ID:", resp)
      if(resp){
        setOpenDialog(false)
      }
    

   }else{
    console.log("ERROR")
   }

   setLoading(false);
   console.log(JsonResponse)
   



  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all delay-100"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add new</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  {/* <h2>Tell us more about your job interviewing</h2> */}
                  <h2>
                    Add Details about your job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      onChange={(event) => setJobPosition(event.target.value)}
                      placeholder="Ex. Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      onChange={(event) => setJobDesc(event.target.value)}
                      placeholder="Ex. React, Angular, NodeJs, NextJs etc."
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Years of experience</label>
                    <Input
                      onChange={(event) => setJobExperience(event.target.value)}
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;

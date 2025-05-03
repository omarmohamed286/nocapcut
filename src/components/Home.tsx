import { useLocation } from "wouter";

import ShowVideoDialog from "./ShowVideoDialog";

const Home = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-dvh bg-black text-white">
      <header>
        <img
          src="src/assets/logo.webp"
          alt="NoCapCut"
          width={200}
          className="mx-auto"
        />
      </header>
      <main className="flex gap-10 items-center justify-center max-lg:flex-col-reverse max-lg:mx-5 max-lg:py-5">
        <article className="basis-1/3 space-y-10">
          <h2 className="text-6xl max-sm:text-4xl">
            NoCap Cut - video editing in the browser
          </h2>
          <p className="font-inter leading-7 text-dark-grey max-sm:text-sm">
            NoCap Cut kinda demonstrates how genius i am in choosing the name.
            it's a word play, you got it? nocap per se means no lie and also cap
            cut is a video editing software! anyways it's always lame if u
            explain it. just spitting shit to fill the space cuz i have nothing
            to say.
          </p>
          <button
            className="relative block p-0.5 rounded-full bg-gradient-to-r from-blue to-violet mx-auto"
            aria-roledescription="Start editing Now!"
            onClick={() => navigate("/app")}
          >
            <span className="block px-6 py-2 rounded-full bg-black font-medium">
              Start editing Now!
            </span>
          </button>
        </article>
        <article className="bg-ellipse bg-no-repeat bg-cover bg-center">
          <div className="relative inline-block ">
            <img src="src/assets/rectangle.png" alt="Rectangle" />
            <div className="bg-editing1 bg-cover rounded-full w-40 h-40 absolute -top-2 -left-2 grid place-content-center">
              <ShowVideoDialog
                trigger={
                  <button>
                    <i className="fa-solid fa-play text-6xl play-icon"></i>
                  </button>
                }
                videoPath="src/assets/video-editing-1.mp4"
              ></ShowVideoDialog>
            </div>
            <div className="bg-editing2 bg-cover rounded-full w-40 h-40 absolute -bottom-2 -right-2 grid place-content-center">
              <ShowVideoDialog
                trigger={
                  <button>
                    <i className="fa-solid fa-play text-6xl play-icon"></i>
                  </button>
                }
                videoPath="src/assets/video-editing-2.mp4"
              ></ShowVideoDialog>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Home;

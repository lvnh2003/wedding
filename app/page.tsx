"use client";

import { useState, useEffect, useRef } from "react";

const CalendarWidget = () => {
  const daysInMay = 31;
  const startDay = 1; // 0 = Sunday
  const weddingDay = 14;
  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMay; i++) days.push(i);

  return (
    <div className="grid grid-cols-7 gap-2 text-center text-xs font-light text-white">
      {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
        <div key={day} className="tracking-widest opacity-80">
          {day}
        </div>
      ))}
      {days.map((day, idx) => (
        <div
          key={idx}
          className={`aspect-square flex items-center justify-center text-sm ${
            day === weddingDay
              ? "text-white font-semibold relative"
              : day
              ? "text-white/70"
              : ""
          }`}
        >
          {day && day !== weddingDay && day}
          {day === weddingDay && (
            <span className="relative flex items-center justify-center text-base">
              <img src="/heart.png" alt="" />
              <span className="absolute text-white font-semibold text-sm">
                {day}
              </span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const SongHui = ({ size = "text-2xl" }: { size?: string }) => {
  // Sử dụng ảnh chữ 囍 màu đỏ - bạn có thể thay thế URL này bằng ảnh của bạn
  return (
    <div className={`${size} flex items-center justify-center text-[#8b1a1a]`}>
      <img
        src="/double-happy.png"
        alt="Double happiness"
        className="h-20 w-auto object-contain"
        onError={(e) => {
          // Fallback: hiển thị chữ 囍 nếu ảnh không load được
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          if (target.parentElement) {
            target.parentElement.innerHTML =
              '<span style="font-size: inherit;">囍</span>';
          }
        }}
      />
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = new Date("2025-12-14T12:00:00");

    const updateTimer = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const boxes = [
    { value: timeLeft.days, label: "ngày" },
    { value: timeLeft.hours, label: "giờ" },
    { value: timeLeft.minutes, label: "phút" },
    { value: timeLeft.seconds, label: "giây" },
  ];

  return (
    <div className="flex justify-center gap-2">
      {boxes.map((box, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center rounded-md bg-[#8b1a1a] px-3 py-4 text-white shadow-md"
          style={{ minWidth: "60px" }}
        >
          <span className="text-2xl font-light leading-none">{box.value}</span>
          <span className="mt-2 text-xs font-light">{box.label}</span>
        </div>
      ))}
    </div>
  );
};

// Hook for scroll animations
const useScrollAnimation = (
  animationType: string = "fadeIn",
  delay: number = 0
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return { ref, isVisible, animationType };
};

// Scroll Animation Component
const ScrollAnimation = ({
  children,
  animation = "fadeIn",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  animation?:
    | "fadeIn"
    | "fadeLeft"
    | "fadeRight"
    | "fadeUp"
    | "fadeDown"
    | "zoomIn"
    | "slideUp";
  delay?: number;
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation(animation, delay);

  const animationClasses = {
    fadeIn: isVisible ? "animate-fade-in" : "opacity-0",
    fadeLeft: isVisible ? "animate-fade-left" : "opacity-0 translate-x-[-30px]",
    fadeRight: isVisible
      ? "animate-fade-right"
      : "opacity-0 translate-x-[30px]",
    fadeUp: isVisible ? "animate-fade-up" : "opacity-0 translate-y-[30px]",
    fadeDown: isVisible ? "animate-fade-down" : "opacity-0 translate-y-[-30px]",
    zoomIn: isVisible ? "animate-zoom-in" : "opacity-0 scale-95",
    slideUp: isVisible ? "animate-slide-up" : "opacity-0 translate-y-[50px]",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${animationClasses[animation]} ${className}`}
    >
      {children}
    </div>
  );
};

const RSVPForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    attending: "yes",
    guests: "1",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể gửi email");
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        attending: "yes",
        guests: "1",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm text-gray-700 mb-2"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Họ và tên
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          placeholder="Nhập họ tên của bạn"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Bạn sẽ tham dự không?
          </label>
          <select
            name="attending"
            value={formData.attending}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          >
            <option value="yes">Có, tôi sẽ đến</option>
            <option value="no">Tiếc là không thể</option>
            <option value="maybe">Chưa chắc chắn</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm text-gray-700 mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Số lượng khách
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "khách" : "khách"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          className="block text-sm text-gray-700 mb-2"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Lời nhắn (tùy chọn)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
          rows={4}
          placeholder="Viết một lời chúc mừng..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-[#8b1a1a] text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {isLoading ? "Đang gửi..." : "XÁC NHẬN THAM DỰ"}
      </button>

      {isSubmitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
          ✓ Cảm ơn! Chúng tôi đã nhận được xác nhận của bạn.
        </div>
      )}
    </form>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio ref={audioRef} src="audio.mp3" />

      <button
        onClick={toggleMusic}
        className="relative w-14 h-14 bg-[#8b1a1a] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95"
        title={isPlaying ? "Tắt nhạc" : "Phát nhạc"}
      >
        {isPlaying ? (
          <div
            className={`text-white text-2xl animate-spin`}
            style={{ animationDuration: "1.5s" }}
          >
            ♪
          </div>
        ) : (
          <div className="text-white text-2xl">♪</div>
        )}
      </button>
    </div>
  );
};

export default function WeddingInvitation() {
  return (
    <main className="min-h-screen bg-[#f3f1ed] text-gray-900 overflow-hidden">
      <div className="mx-auto max-w-[460px] bg-white shadow-2xl">
        <MusicPlayer />
        {/* COVER */}
        <section className="relative h-[720px] overflow-hidden">
          <img
            src="/footer.png"
            alt="Wedding cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          <p
            className="absolute top-8 w-full px-6 text-center text-[13px] font-light text-white leading-relaxed tracking-wider"
          >
            I love three things in this world, Sun, moon and you. <br />
            Sun for morning, moon for night, and you forever.
          </p>
          <h1
            className="absolute uppercase inset-x-0 top-1/2 -translate-y-9/10 px-6 text-center text-4xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            <div className="whitespace-nowrap">
            welcome to our 
            </div>
            wedding
          </h1>
          <div className="absolute bottom-15 inset-x-0 px-6 text-white">
            <div className="flex items-center justify-around gap-10 text-[25px]">
              <div className="flex flex-col items-center ml-5">
                <p style={{ fontFamily: "var(--font-cormorant)" }}>Ái Tiên</p>
                <p className="tracking-widest text-[11px]">BRIDE</p>
              </div>
              <div className="flex flex-col items-center">
                <p style={{ fontFamily: "var(--font-cormorant)" }}>Quốc Điển</p>
                <p className="tracking-widest text-[11px]">GROOM</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 inset-x-0 px-6 text-white">
            <div className="flex items-center justify-center text-[20px]">
              <div className="text-center">
                <p
                  className="tracking-[0.4em]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  14.12.2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="border-t border-gray-200 bg-white">
          <ScrollAnimation animation="fadeLeft" delay={0}>
            <div
              className="flex items-center justify-between px-6 py-4 text-[12px] tracking-[0.4em]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              <span>WEDDING</span>
              <span>INVITATION</span>
              <span className="text-[15px]">2025</span>
            </div>
          </ScrollAnimation>
          <div className="relative h-[250px]">
            <img
              src="/invitation-background.png"
              alt="Right love"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <ScrollAnimation animation="fadeDown" delay={200}>
                <p
                  className="text-lg"
                  style={{ fontFamily: "var(--font-dancing)" }}
                >
                  Right love | Right reason | Right for you
                </p>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={400}>
                <p className="mt-4 text-[13px] leading-relaxed font-light">
                  To Our Family And Friends, Thank You For Celebrating Our
                  Special Day, Supporting Us And Sharing Our Love.
                </p>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className=" bg-white px-10 py-6 text-center">
          <ScrollAnimation animation="fadeDown" delay={200}>
            <h3
              className="mt-4 text-2xl tracking-[0.2em] text-center"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              OUR LOVE STORY
            </h3>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="relative mt-4 shadow-lg">
              <img
                src="/sit-together.png"
                alt="Love story"
                className="h-[400px] w-full object-cover bg-center bg-no-repeat"
              />
              <ScrollAnimation animation="fadeRight" delay={300}>
                <p
                  className="pointer-events-none absolute -bottom-6 -right-6 z-10 rotate-[-12deg] text-[52px] leading-none text-[#e6403b] drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
                  style={{ fontFamily: "var(--font-dancing)" }}
                >
                  Sweet
                </p>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeUp" delay={200}>
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/4f9cc258-948c-4b45-b2fb-9075905dc57f.png"
                  alt="Wedding invitation flourish left"
                  className="h-10 w-10 scale-x-[-1] object-contain"
                />
                <p
                  className="text-[13px] tracking-[0.6em] text-gray-600"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  WEDDING <br /> INVITATION
                </p>
                <img
                  src="https://cdn.cinelove.me/templates/assets/7e275458-268a-4dad-b147-1af6ad9abb46/4f9cc258-948c-4b45-b2fb-9075905dc57f.png"
                  alt="Wedding invitation flourish right"
                  className="h-10 w-10 object-contain -ml-4 -rotate-5"
                />
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeIn" delay={400}>
            <div
              className="mx-auto mt-6 max-w-[360px] space-y-2 text-[13px] leading-relaxed text-gray-700"
            >
              <p>Trước đây cứ nghĩ đám cưới chỉ là một thông báo chính thức.</p>
              <p>Giờ mới hiểu đó là một dịp hiếm hoi để mọi người tụ họp.</p>
              <p>Là những chuyến đi xa chỉ để có mặt bên nhau.</p>
              <p>Là sự ủng hộ vô điều kiện từ những người thương yêu.</p>
              <p>Cảm ơn gia đình, bạn bè đã luôn đồng hành.</p>
              <p>Lâu rồi không gặp, thật sự rất nhớ mọi người!</p>
            </div>
          </ScrollAnimation>
        </section>

        {/* SECTION 4 */}
        <section className="relative bg-white px-6 py-12">
          {/* Title ở góc trên phải */}
          <div>
            <div className="absolute right-6 top-4 z-100 text-right">
              <p
                className="text-5xl text-[#e6403b]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                OUR
              </p>
              <p
                className="text-3xl font-bold text-[#e6403b]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                LOVE STORY
              </p>
            </div>
          </div>

          <div>
            <div className="absolute left-[-50px] top-1/3 z-10">
              <div className="">
                <p
                  className="rotate-[-90deg] whitespace-nowrap text-[15px] leading-relaxed text-gray-700"
                  style={{ fontFamily: "var(--font-dancing)" }}
                >
                  Love goes with the wind. but never goes away.
                </p>
              </div>
            </div>
          </div>

          <div className="">
            <ScrollAnimation animation="fadeRight" delay={100}>
              <div className="ml-auto overflow-hidden shadow-lg w-4/5">
                <img
                  src="/read.png"
                  alt="Love story main"
                  className="h-[380px] w-full object-cover bg-bottom"
                />
              </div>
            </ScrollAnimation>

            {/* Ảnh nhỏ ở dưới với date bên phải */}
            <ScrollAnimation animation="fadeUp" delay={300}>
              <div className="relative">
                <div className="mr-16 overflow-hidden border-12 border-white -mt-12">
                  <img
                    src="/read2.png"
                    alt="Love story secondary"
                    className="h-[240px] w-full object-cover"
                  />
                </div>
                {/* Date dọc bên phải */}
                <div>
                  <p
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 rotate-90 text-[20px] tracking-[0.6em] text-gray-700"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    14.12
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className="bg-white px-6 pt-0 text-center relative">
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="flex justify-center">
              <SongHui size="text-4xl" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeDown" delay={200}>
            <h3
              className="mt-4 text-2xl tracking-[0.5em]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              FALL IN LOVE
            </h3>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeIn" delay={300}>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Mong rằng khi ngoảnh lại, ta vẫn có nhau. <br />
              Cùng nắm tay đi đến bạc đầu.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeLeft" delay={400}>
            <div
              className="mt-8 flex justify-between text-[11px] uppercase tracking-[0.6em] text-gray-600"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              <span>YOU ARE</span>
              <span>MY DEAREST</span>
              <span>LOVE</span>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={500}>
            <div className="mt-8">
              <img
                src="/looking-moutain.png"
                alt="Embrace"
                className="h-[320px] w-full object-cover"
              />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeRight" delay={600}>
            <p
              className="mt-6 text-4xl text-[#8b1a1a] absolute right-0 -bottom-8"
              style={{ fontFamily: "var(--font-dancing)" }}
            >
              Love and freedom <br /> you and gentleness
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeIn" delay={400}>
            <div
              className="mx-auto mt-12 max-w-[360px] space-y-2 text-[13px] leading-relaxed text-gray-700"
            >
              <p>Núi biếc rừng xanh vang vọng tiếng lòng, </p>
              <p>Giữa thế gian rộng lớn, người chung nhịp vẫn tìm thấy nhau.</p>
              <p>
                Tình yêu đến như một lẽ tự nhiên, Và chúng ta nắm tay nhau đi
                đến trọn đời.
              </p>
            </div>
          </ScrollAnimation>
        </section>

        {/* SECTION 6 */}
        <section className="bg-white pb-12">
          <ScrollAnimation animation="zoomIn" delay={200}>
            <div className="mt-8 space-y-2 flex justify-around">
              <img
                src="/small1.png"
                alt="Info 1"
                className="h-[250px] object-cover"
              />
              <img
                src="/small2.png"
                alt="Info 2"
                className="h-[250px] object-cover"
              />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeIn" delay={300}>
            <p className="mt-8 text-center px-6 text-sm leading-relaxed text-gray-600">
              I love three things in this world, Sun, moon and you. Sun for
              morning, moon for night, and you forever.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={400}>
            <div className="mt-6 flex flex-col items-center gap-4">
              <SongHui size="text-6xl" />
              <p
                className="text-3xl tracking-[0.3em]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                YOU ARE PERFECT
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={500}>
            <p className="mt-4 text-center text-xs italic text-gray-400">
              Thương một người, dành trọn mọi đời
            </p>
          </ScrollAnimation>
        </section>

        {/* SECTION 7 */}
        <section className="bg-white pb-12">
          <ScrollAnimation animation="zoomIn" delay={200}>
            <div className="relative mt-4 h-[500px] overflow-hidden">
              <img
                src="/looking.png"
                alt="Calendar"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-6 inset-x-6 flex items-center justify-between text-[12px] tracking-[0.5em] text-white pointer-events-none">
                <span>DEC.14</span>
                <span>2025</span>
                <span>FALL IN</span>
                <span>LOVE</span>
              </div>
              <div>
                <div className="absolute inset-x-8 bottom-10 bg-black/20 p-6">
                  <div className="text-center text-[11px] uppercase tracking-[0.6em] text-white">
                    Wedding Invitation
                  </div>
                  <div className="mt-4">
                    <CalendarWidget />
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
          <div className="mt-8 space-y-6">
            <ScrollAnimation animation="fadeDown" delay={500}>
              <div className="text-center">
                <p
                  className="text-xl text-gray-700 leading-relaxed font-bold"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Chủ Nhật, 14.12.2025
                  <br />
                  Âm lịch 25/10 | 11:00 AM
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="zoomIn" delay={600}>
              <CountdownTimer />
            </ScrollAnimation>
          </div>
        </section>
        <section className="bg-white py-6">
          <ScrollAnimation animation="fadeUp" delay={0}>
            <div className="mb-4">
              <h2
                className="text-3xl text-center text-[#8b1a1a] mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                ĐỊA CHỈ NHÀ HÀNG
              </h2>
              <p className="text-center text-sm text-gray-600 italic mb-4">
                Chúng tôi mong bạn sẽ ghé thăm
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={300}>
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center">
                <h3
                  className="text-lg font-light text-gray-800 mb-2 uppercase"
                >
                  Nhà hàng Tiệc Cưới
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <div
                    className="text-5xl"
                    style={{ fontFamily: "var(--font-dancing)" }}
                  >
                    Tân Sơn Nhất Pavillon
                  </div>
                  <div className="mt-3 font-bold">SẢNH TITAN 1G1 - TẦNG 5</div>
                  <div>200 -202 HOÀNG VĂN THỤ, P.ĐỨC THUẬN, TP.HCM</div>
                </p>
              </div>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={200}>
            <div className="relative w-full h-[320px] overflow-hidden mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.137852950251!2d106.66827172559809!3d10.80075223934951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752928b68fbc3f%3A0xc58bea5686708420!2zVHJ1bmcgVMOibSBI4buZaSBOZ2jhu4sgJiBUaeG7h2MgQ8aw4bubaSBQYXZpbGxvbiBUw6JuIFPGoW4gTmjhuqV0!5e0!3m2!1sen!2s!4v1763449810597!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollAnimation>
          
        </section>

        {/* SECTION 9: Sunshine spread */}
        <section className="bg-white pb-16 pt-0 space-y-6">
        <ScrollAnimation animation="fadeLeft" delay={200}>
            <div
              className="flex items-center justify-around text-[12px] uppercase tracking-[0.6em] text-gray-700 animate-fade-up anim-delay-100"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              <span>LOVE YOU</span>
              <span>FOREVER</span>
              <span>AND EVER</span>
            </div>
          </ScrollAnimation>
          {/* Top photo - playful moment */}
          <ScrollAnimation animation="fadeUp" delay={0}>
            <div className="overflow-hidden animate-fade-up">
              <img
                src="/footer-image1.png"
                alt="Playful moment"
                className="h-[200px] w-full object-cover"
              />
            </div>
          </ScrollAnimation>

          {/* Text divider */}
          <ScrollAnimation animation="fadeLeft" delay={200}>
            <div
              className="flex items-center justify-around text-[12px] uppercase tracking-[0.6em] text-gray-700 animate-fade-up anim-delay-100"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              <span>LOVE YOU</span>
              <span>FOREVER</span>
              <span>AND EVER</span>
            </div>
          </ScrollAnimation>

          {/* Bottom photo - intimate moment with text overlay */}
          <ScrollAnimation animation="zoomIn" delay={300}>
            <div className="relative overflow-hidden animate-soft-zoom">
              <img
                src="/footer-image.png"
                alt="Sunshine embrace"
                className="h-[420px] w-full object-cover"
              />
              {/* White layer opening from bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-white via-white/70 to-transparent animate-white-reveal" />
              <div>
                <p
                  className="absolute left-6 top-8 text-4xl text-white z-10"
                  style={{ fontFamily: "var(--font-dancing)" }}
                >
                  You ar my
                  <br /> Sunshine
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </section>
        <section className="bg-white pt-0 px-6">
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="mb-8">
              <h2
                className="text-3xl font-light text-center text-[#8b1a1a] mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                XÁC NHẬN THAM DỰ
              </h2>
              <p className="text-center text-sm text-gray-600 italic">
                Vui lòng xác nhận trước ngày 14/12/2025
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeUp" delay={200}>
            <div className="max-w-md mx-auto">
              <RSVPForm />
            </div>
          </ScrollAnimation>
        </section>
        {/* FOOTER */}
        <footer className="px-6 py-12 text-center">
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="flex justify-center">
              <SongHui size="text-6xl" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={200}>
            <p
              className="mt-4 text-sm tracking-[0.4em]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              THANK YOU FOR BEING PART OF OUR LOVE STORY
            </p>
          </ScrollAnimation>
        </footer>
      </div>
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softZoom {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes whiteReveal {
          from {
            clip-path: inset(100% 0 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 900ms ease both;
        }

        .animate-soft-zoom {
          animation: softZoom 1100ms ease both;
        }

        .animate-fade-in {
          animation: fadeIn 800ms ease-out both;
        }

        .animate-fade-left {
          animation: fadeLeft 800ms ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 800ms ease-out both;
        }

        .animate-fade-down {
          animation: fadeDown 800ms ease-out both;
        }

        .animate-zoom-in {
          animation: zoomIn 800ms ease-out both;
        }

        .animate-slide-up {
          animation: slideUp 1000ms ease-out both;
        }

        .animate-white-reveal {
          animation: whiteReveal 1500ms ease-out both;
        }

        .anim-delay-100 {
          animation-delay: 120ms;
        }
      `}</style>
    </main>
  );
}

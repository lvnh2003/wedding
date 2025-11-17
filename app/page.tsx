'use client'

import { useState, useEffect, useRef } from 'react';

const CalendarWidget = () => {
  const daysInMay = 31;
  const startDay = 3; // 0 = Sunday
  const weddingDay = 21;
  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMay; i++) days.push(i);

  return (
    <div className="grid grid-cols-7 gap-2 text-center text-xs font-light text-white">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
        <div key={day} className="tracking-widest opacity-80">
          {day}
        </div>
      ))}
      {days.map((day, idx) => (
        <div
          key={idx}
          className={`aspect-square flex items-center justify-center text-sm ${
            day === weddingDay
              ? 'text-white font-semibold relative'
              : day
              ? 'text-white/70'
              : ''
          }`}
        >
          {day && day !== weddingDay && day}
          {day === weddingDay && (
            <span className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
              {day}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const SongHui = ({ size = 'text-2xl' }: { size?: string }) => {
  // Sử dụng ảnh chữ 囍 màu đỏ - bạn có thể thay thế URL này bằng ảnh của bạn
  return (
    <div className={`${size} flex items-center justify-center text-red-600`}>
      <img
        src="/double-happy.png"
        alt="Double happiness"
        className="h-20 w-auto object-contain"
        onError={(e) => {
          // Fallback: hiển thị chữ 囍 nếu ảnh không load được
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = '<span style="font-size: inherit;">囍</span>';
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
    const weddingDate = new Date('2025-12-14T12:00:00');
    
    const updateTimer = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
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
    { value: timeLeft.days, label: 'ngày' },
    { value: timeLeft.hours, label: 'giờ' },
    { value: timeLeft.minutes, label: 'phút' },
    { value: timeLeft.seconds, label: 'giây' },
  ];

  return (
    <div className="flex justify-center gap-2">
      {boxes.map((box, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center rounded-md bg-[#8b1a1a] px-3 py-4 text-white shadow-md"
          style={{ minWidth: '60px' }}
        >
          <span className="text-3xl font-light leading-none">{box.value}</span>
          <span className="mt-2 text-xs font-light">{box.label}</span>
        </div>
      ))}
    </div>
  );
};

// Hook for scroll animations
const useScrollAnimation = (animationType: string = 'fadeIn', delay: number = 0) => {
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
        rootMargin: '0px 0px -50px 0px',
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
  animation = 'fadeIn',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'fadeUp' | 'fadeDown' | 'zoomIn' | 'slideUp';
  delay?: number;
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation(animation, delay);

  const animationClasses = {
    fadeIn: isVisible ? 'animate-fade-in' : 'opacity-0',
    fadeLeft: isVisible ? 'animate-fade-left' : 'opacity-0 translate-x-[-30px]',
    fadeRight: isVisible ? 'animate-fade-right' : 'opacity-0 translate-x-[30px]',
    fadeUp: isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-[30px]',
    fadeDown: isVisible ? 'animate-fade-down' : 'opacity-0 translate-y-[-30px]',
    zoomIn: isVisible ? 'animate-zoom-in' : 'opacity-0 scale-95',
    slideUp: isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-[50px]',
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

export default function WeddingInvitation() {
  return (
    <main className="min-h-screen bg-[#f3f1ed] py-10 text-gray-900">
      <div className="mx-auto max-w-[460px] bg-white shadow-2xl">
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
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            I love three things in this world, Sun, moon and you. <br />
            Sun for morning, moon for night, and you forever.
          </p>
          <h1
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-4xl font-light text-white tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Welcome to our wedding
          </h1>
          <p
            className="absolute left-8 bottom-32 rotate-[-6deg] text-3xl text-white drop-shadow-lg"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            We got married
          </p>
          <div className="absolute bottom-16 inset-x-0 px-6 text-white">
            <div className="flex items-end justify-between text-[13px]">
              <div>
                <p style={{ fontFamily: 'var(--font-cormorant)' }}>Ai Tien</p>
                <p className="tracking-widest text-[11px]">BRIDE</p>
              </div>
              <div className="text-center">
                <p className="tracking-[0.4em]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  2025.05.20
                </p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: 'var(--font-cormorant)' }}>Quoc Dien</p>
                <p className="tracking-widest text-[11px]">GROOM</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full border-t border-white/50 py-4 text-center text-[12px] tracking-[0.6em] text-white">
            WEDDING INVITATION 2025
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="border-t border-gray-200 bg-white">
          <ScrollAnimation animation="fadeLeft" delay={0}>
            <div className="flex items-center justify-between px-6 py-4 text-[12px] tracking-[0.4em]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              <span>WEDDING</span>
              <span>INVITATION</span>
              <span>2025</span>
            </div>
          </ScrollAnimation>
          <div className="relative h-[340px]">
            <img src="/footer.png" alt="Right love" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <ScrollAnimation animation="fadeDown" delay={200}>
                <p className="text-lg tracking-[0.3em]" style={{ fontFamily: 'var(--font-dancing)' }}>
                  Right love | Right reason | Right for you
                </p>
              </ScrollAnimation>
              <ScrollAnimation animation="fadeUp" delay={400}>
                <p className="mt-4 text-[13px] leading-relaxed font-light">
                  To Our Family And Friends, Thank You For Celebrating Our Special Day,
                  Supporting Us And Sharing Our Love.
                </p>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="border-t border-gray-200 bg-white px-10 py-14 text-center">
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="relative mt-4 shadow-lg">
              <img src="/footer.png" alt="Love story" className="h-[320px] w-full object-cover" />
              <ScrollAnimation animation="fadeRight" delay={300}>
                <p
                  className="pointer-events-none absolute -bottom-6 -right-6 z-10 rotate-[-12deg] text-[52px] leading-none text-[#e6403b] drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
                  style={{ fontFamily: 'var(--font-dancing)' }}
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
                  style={{ fontFamily: 'var(--font-cormorant)' }}
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
              style={{ fontFamily: 'var(--font-cormorant)' }}
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
        <section className="relative border-t border-gray-200 bg-white px-6 py-12">
          {/* Title ở góc trên phải */}
          <ScrollAnimation animation="fadeDown" delay={0}>
            <div className="absolute right-6 top-4 z-10 text-right">
              <p className="text-5xl text-[#e6403b]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                OUR
              </p>
              <p className="text-3xl font-bold text-[#e6403b]" style={{ fontFamily: 'var(--font-cormorant)' }}>
                LOVE STORY
              </p>
            </div>
          </ScrollAnimation>

          <div>
            <div className="absolute left-[-80px] top-1/3 z-10">
              <div className="">
                <p
                  className="rotate-[-90deg] whitespace-nowrap text-[15px] leading-relaxed text-gray-700"
                  style={{ fontFamily: 'var(--font-dancing)' }}
                >
                  Love goes with the wind. but never goes away.
                </p>
              </div>
            </div>
          </div>

          <div className="">
            <ScrollAnimation animation="fadeRight" delay={100}>
              <div className="ml-auto overflow-hidden shadow-lg w-4/5">
                <img src="/footer.png" alt="Love story main" className="h-[380px] w-full object-cover" />
              </div>
            </ScrollAnimation>

            {/* Ảnh nhỏ ở dưới với date bên phải */}
            <ScrollAnimation animation="fadeUp" delay={300}>
              <div className="relative">
                <div className="mr-16 overflow-hidden border-12 border-white -mt-12">
                  <img src="/footer.png" alt="Love story secondary" className="h-[240px] w-full object-cover" />
                </div>
                {/* Date dọc bên phải */}
                <div>
                  <p
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 rotate-90 text-[15px] tracking-[0.6em] text-gray-700"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    05.20
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className="border-t border-gray-200 bg-white px-6 py-12 text-center relative">
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="flex justify-center">
              <SongHui size="text-4xl" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeDown" delay={200}>
            <h3
              className="mt-4 text-2xl tracking-[0.5em]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
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
            <div className="mt-8 flex justify-between text-[11px] uppercase tracking-[0.6em] text-gray-600" style={{ fontFamily: 'var(--font-cormorant)' }}>
              <span>YOU ARE</span>
              <span>MY DEAREST</span>
              <span>LOVE</span>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={500}>
            <div className="mt-8">
              <img src="/footer.png" alt="Embrace" className="h-[320px] w-full object-cover" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeRight" delay={600}>
            <p
              className="mt-6 text-4xl text-red-600 absolute right-0 bottom-5"
              style={{ fontFamily: 'var(--font-dancing)' }}
            >
              Love and freedom <br /> you and gentleness
            </p>
          </ScrollAnimation>
        </section>

        {/* SECTION 6 */}
        <section className="border-t border-gray-200 bg-white px-6 py-12">
          <ScrollAnimation animation="fadeLeft" delay={0}>
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 text-[12px] tracking-[0.4em]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              <span>LOVE</span>
              <span>WEDDING</span>
              <span>INFORMATION</span>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={200}>
            <div className="mt-8 space-y-2 flex justify-around">
              <img src="/footer.png" alt="Info 1" className="h-[250px] object-cover" />
              <img src="/footer.png" alt="Info 2" className="h-[250px] object-cover" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeIn" delay={300}>
            <p className="mt-8 text-center text-sm leading-relaxed text-gray-600">
              I love three things in this world, Sun, moon and you. Sun for morning,
              moon for night, and you forever.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={400}>
            <div className="mt-6 flex flex-col items-center gap-4">
              <SongHui size="text-6xl" />
              <p className="text-3xl tracking-[0.3em]" style={{ fontFamily: 'var(--font-playfair)' }}>
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
        <section className="border-t border-gray-200 bg-white px-6 py-12">
          <ScrollAnimation animation="fadeLeft" delay={0}>
            <div className="flex items-center justify-between text-[11px] tracking-[0.5em] text-gray-700" style={{ fontFamily: 'var(--font-cormorant)' }}>
              <span>NO.12</span>
              <span>05.20</span>
              <span>FALL IN LOVE</span>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="zoomIn" delay={200}>
            <div className="relative mt-4 h-[420px] overflow-hidden">
              <img src="/footer.png" alt="Calendar" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/35" />
              <ScrollAnimation animation="fadeUp" delay={400}>
                <div className="absolute inset-x-8 bottom-10 rounded-3xl bg-white/15 p-6 backdrop-blur">
                  <div className="text-center text-[11px] uppercase tracking-[0.6em] text-white">
                    Wedding Invitation
                  </div>
                  <div className="mt-4">
                    <CalendarWidget />
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
          <div className="mt-8 space-y-6">
            <ScrollAnimation animation="fadeDown" delay={500}>
              <div className="text-center">
                <p className="text-sm italic text-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  Thứ Bảy, 20.05.2025<br />
                  Âm lịch 22/4 | 12:00 PM
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="zoomIn" delay={600}>
              <CountdownTimer />
            </ScrollAnimation>

            <ScrollAnimation animation="fadeIn" delay={700}>
              <div className="mt-8 text-left">
                <div className="space-y-2 text-sm leading-relaxed text-gray-600" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  <p>Ánh trời bừng sáng, rơi vào chốn nhân gian.</p>
                  <p>Ta vượt ngàn sông núi.</p>
                  <p>Chỉ để cùng em</p>
                  <p>Đi qua bốn mùa, dùng chung ba bữa</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* SECTION 8: Collage */}
        <section className="border-t border-gray-200 bg-white py-16">
          <div className="relative animate-fade-up">
            <div className="absolute top-7 h-80 w-full bg-[#e4e8de]" />
            <ScrollAnimation animation="fadeRight" delay={0}>
              <div className="relative z-10 ml-auto grid grid-cols-2 gap-4 px-6" style={{ maxWidth: '85%' }}>
                {[1, 2].map(item => (
                  <div
                    key={item}
                    className="overflow-hidden border border-white/70 shadow-lg shadow-black/10 animate-soft-zoom anim-delay-100"
                  >
                    <img src="/footer.png" alt={`Collage ${item}`} className="h-48 w-full object-cover" />
                  </div>
                ))}
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fadeIn" delay={300}>
              <p
                className="relative z-10 mt-5 ml-5 text-[20px] leading-relaxed text-gray-700"
                style={{ fontFamily: 'var(--font-dancing)' }}
              >
                As the clouds and mist dissipate<br />
                love you and everyone knows it
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="zoomIn" delay={400}>
              <div className="relative z-10 mt-6 flex items-stretch gap-4">
                <div className="ml-10 flex-1 border border-white/70 bg-white p-3 shadow-xl shadow-black/10">
                  <div className="h-[300px] overflow-hidden border border-gray-100">
                    <img src="/footer.png" alt="Forever moment" className="h-full w-full object-cover" />
                  </div>
                </div>
                <ScrollAnimation animation="fadeLeft" delay={600}>
                  <div className="flex w-[58px] items-center justify-center text-[12px] tracking-[0.6em] text-gray-700">
                    <span className="-rotate-90 mt-40 font-bold" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      FOREVER&nbsp;AND&nbsp;EVER
                    </span>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* SECTION 9: Sunshine spread */}
        <section className="border-t border-gray-200 bg-white px-6 py-16 space-y-6">
          {/* Top photo - playful moment */}
          <ScrollAnimation animation="fadeUp" delay={0}>
            <div className="overflow-hidden shadow-lg animate-fade-up">
              <img src="/footer.png" alt="Playful moment" className="h-[320px] w-full object-cover" />
            </div>
          </ScrollAnimation>

          {/* Text divider */}
          <ScrollAnimation animation="fadeLeft" delay={200}>
            <div
              className="flex items-center justify-between border-y border-gray-300 py-4 text-[12px] uppercase tracking-[0.6em] text-gray-700 animate-fade-up anim-delay-100"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              <span>LOVE YOU</span>
              <span>FOREVER</span>
              <span>AND EVER</span>
            </div>
          </ScrollAnimation>

          {/* Bottom photo - intimate moment with text overlay */}
          <ScrollAnimation animation="zoomIn" delay={300}>
            <div className="relative overflow-hidden shadow-2xl animate-soft-zoom">
              <img src="/footer.png" alt="Sunshine embrace" className="h-[420px] w-full object-cover" />
              <ScrollAnimation animation="fadeRight" delay={500}>
                <p
                  className="absolute left-6 top-8 text-4xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: 'var(--font-dancing)' }}
                >
                  You ar my<br /> Sunshine
                </p>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 px-6 py-12 text-center">
          <ScrollAnimation animation="zoomIn" delay={0}>
            <div className="flex justify-center">
              <SongHui size="text-6xl" />
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fadeUp" delay={200}>
            <p
              className="mt-4 text-sm tracking-[0.4em]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
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

        .anim-delay-100 {
          animation-delay: 120ms;
        }
      `}</style>
    </main>
  );
}

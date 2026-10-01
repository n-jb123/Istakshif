import React from 'react';
import { Trip } from '../../types';
import { useApp } from '../../context/AppContext';
import { GOVERNORATES, NATURE_CATEGORIES_INFO } from '../../data/mockData';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Flame,
  Star,
  Mountain,
  Compass,
} from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { navigate, favorites, toggleFavorite } = useApp();

  const isFav = favorites.includes(trip.id);
  const fromGov = GOVERNORATES.find(g => g.id === trip.fromGovernorateId)?.nameAr || trip.fromGovernorateId;
  const toGov = GOVERNORATES.find(g => g.id === trip.toGovernorateId)?.nameAr || trip.toGovernorateId;
  const mainCategory = NATURE_CATEGORIES_INFO.find(c => c.id === trip.categories[0])?.nameAr || 'طبيعة ومغامرات';

  const seatsLeft = trip.seatsTotal - trip.seatsTaken;
  const isFull = trip.status === 'full' || seatsLeft <= 0;

  const difficultyLabel =
    trip.difficulty === 'easy'
      ? 'سهل'
      : trip.difficulty === 'medium'
      ? 'متوسط'
      : 'صعب';

  return (
    <div
      onClick={() => navigate('trip-detail', { id: trip.id })}
      className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#123F49] border border-[#E4DCCF] dark:border-[#1C4F5B] hover:shadow-lg dark:hover:border-[#D9603B]/60 transition-all duration-200 cursor-pointer text-right"
    >
      {/* 4:3 Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#0A2E36]">
        <img
          src={trip.images[0]}
          alt={trip.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Gradient scrim at bottom for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top bar over image: Badges + Favorite */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Badges container */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {trip.discountPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#7CFFCB] text-[#0A2E36] shadow-xs">
                <Flame className="w-3.5 h-3.5 text-[#D9603B] fill-current" />
                عرض
              </span>
            )}
            {trip.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D9603B] text-white shadow-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                مميزة
              </span>
            )}
            {isFull && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-700/90 text-white backdrop-blur-xs">
                مكتملة
              </span>
            )}
          </div>

          {/* Favorite heart button */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleFavorite(trip.id);
            }}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFav
                ? 'bg-red-500 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Main Category Chip on bottom right of image */}
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
            <Compass className="w-3 h-3 text-[#7CFFCB]" />
            {mainCategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Region (from ← to) emphasized */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9603B] mb-1.5">
            <span>{fromGov}</span>
            <ArrowLeft className="w-3.5 h-3.5 text-gray-400" />
            <span>{toGov}</span>
          </div>

          {/* Title */}
          <h3 className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] leading-snug line-clamp-1 group-hover:text-[#D9603B] transition-colors">
            {trip.title}
          </h3>

          {/* Date, duration, difficulty */}
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 mt-2">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {trip.startDate}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {trip.durationText}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-gray-400" />
              {difficultyLabel}
            </span>
          </div>
        </div>

        {/* Organizer and Ratings */}
        <div className="pt-2 border-t border-[#E4DCCF]/60 dark:border-[#1C4F5B]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
              {trip.organizerName}
            </span>
            {trip.organizerVerified ? (
              <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-[#7CFFCB] font-bold shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 fill-current/20" />
                موثّق
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] text-gray-400 shrink-0">
                غير موثّق
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-bold text-xs text-[#0A2E36] dark:text-[#F4EFE6]">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{trip.organizerRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Footer: Seats / Waitlist + Price */}
        <div className="pt-1 flex items-end justify-between">
          <div className="text-xs">
            {isFull ? (
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                مكتملة · 5 بقائمة الانتظار
              </span>
            ) : (
              <span className="font-semibold text-emerald-600 dark:text-[#7CFFCB]">
                متبقي {seatsLeft} مقاعد
              </span>
            )}
          </div>

          <div className="text-left">
            {trip.discountPrice ? (
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-xs text-gray-400 line-through tabular-nums">
                  {trip.pricePerPerson.toLocaleString()}
                </span>
                <span className="font-cairo font-bold text-base text-[#D9603B] tabular-nums">
                  {trip.discountPrice.toLocaleString()} <span className="text-xs font-normal">ل.س</span>
                </span>
              </div>
            ) : (
              <span className="font-cairo font-bold text-base text-[#0A2E36] dark:text-[#F4EFE6] tabular-nums">
                {trip.pricePerPerson.toLocaleString()} <span className="text-xs font-normal">ل.س</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

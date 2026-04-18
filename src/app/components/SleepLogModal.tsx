import { useState } from 'react';
import { X, Moon, TrendingUp, MessageSquare, Clock, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface SleepLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SleepLogData) => void;
}

export interface SleepLogData {
  date: string;
  bedtime: string;
  waketime: string;
  timeOutOfBed: string; // When they actually got out of bed
  hoursSlept: number;
  sleepQuality: number; // 1-10 scale
  timeToFallAsleep: number; // minutes
  nightAwakenings: number;
  timeAwakeDuringNight: number; // minutes
  nappedYesterday: boolean;
  napMinutes: number;
  napTimeOfDay: string; // morning, afternoon, evening
  feltRested: number; // 1-5 scale
  notes: string;
}

export default function SleepLogModal({ isOpen, onClose, onSubmit }: SleepLogModalProps) {
  const [bedtime, setBedtime] = useState('22:00');
  const [waketime, setWaketime] = useState('07:00');
  const [timeOutOfBed, setTimeOutOfBed] = useState('07:00');
  const [timeToFallAsleep, setTimeToFallAsleep] = useState<number>(15);
  const [nightAwakenings, setNightAwakenings] = useState<number>(0);
  const [timeAwakeDuringNight, setTimeAwakeDuringNight] = useState<number>(0);
  const [feltRested, setFeltRested] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const [nappedYesterday, setNappedYesterday] = useState<boolean>(false);
  const [napMinutes, setNapMinutes] = useState<number>(0);
  const [napTimeOfDay, setNapTimeOfDay] = useState<string>('morning');
  const [notes, setNotes] = useState('');

  // Prescribed sleep window (these would come from clinician settings)
  const prescribedBedtime = '22:30';
  const prescribedWaketime = '06:30';

  // Calculate hours slept from bedtime and waketime
  const calculateHoursSlept = (bed: string, wake: string): number => {
    const bedDate = new Date(`2000-01-01T${bed}:00`);
    let wakeDate = new Date(`2000-01-01T${wake}:00`);
    
    // If wake time is earlier than bedtime, it's the next day
    if (wakeDate < bedDate) {
      wakeDate = new Date(`2000-01-02T${wake}:00`);
    }
    
    const diff = wakeDate.getTime() - bedDate.getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 2) / 2; // Round to nearest 0.5
  };

  const hoursSlept = calculateHoursSlept(bedtime, waketime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const logData: SleepLogData = {
      date: new Date().toISOString(),
      bedtime,
      waketime,
      timeOutOfBed,
      hoursSlept,
      sleepQuality,
      timeToFallAsleep,
      nightAwakenings,
      timeAwakeDuringNight,
      nappedYesterday,
      napMinutes,
      napTimeOfDay,
      feltRested,
      notes,
    };

    onSubmit(logData);
    
    // Show success toast
    const qualityText = sleepQuality <= 3 ? 'poor' : sleepQuality <= 6 ? 'fair' : sleepQuality <= 8 ? 'good' : 'great';
    toast.success('Sleep log saved!', {
      description: `${hoursSlept} hours logged with ${qualityText} quality (${sleepQuality}/10).`,
    });
    
    // Reset form
    setBedtime('22:00');
    setWaketime('07:00');
    setTimeOutOfBed('07:00');
    setTimeToFallAsleep(15);
    setNightAwakenings(0);
    setTimeAwakeDuringNight(0);
    setFeltRested(3);
    setSleepQuality(5);
    setNappedYesterday(false);
    setNapMinutes(0);
    setNapTimeOfDay('morning');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  const qualityLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const restedLabels = ['Not at all', 'Slightly', 'Moderately', 'Very', 'Completely'];

  // Check if within prescribed window
  const isWithinPrescribedWindow = () => {
    const bedDiff = Math.abs(calculateTimeDiff(bedtime, prescribedBedtime));
    const wakeDiff = Math.abs(calculateTimeDiff(waketime, prescribedWaketime));
    return bedDiff <= 30 && wakeDiff <= 30; // Within 30 minutes
  };

  const calculateTimeDiff = (time1: string, time2: string): number => {
    const date1 = new Date(`2000-01-01T${time1}:00`);
    const date2 = new Date(`2000-01-01T${time2}:00`);
    return (date2.getTime() - date1.getTime()) / (1000 * 60); // minutes
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl">Log Last Night's Sleep</h2>
                <p className="text-sm text-purple-200 mt-1">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bedtime */}
          <div className="space-y-3">
            <Label htmlFor="bedtime" className="text-lg" style={{ color: '#1f1f3d' }}>
              What time did you go to bed?
            </Label>
            <div className="relative">
              <input
                type="time"
                id="bedtime"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
              />
              <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
            {!isWithinPrescribedWindow() && (
              <p className="text-sm text-red-500">
                ⚠️ Bedtime is outside the prescribed window of {prescribedBedtime}.
              </p>
            )}
          </div>

          {/* Waketime */}
          <div className="space-y-3">
            <Label htmlFor="waketime" className="text-lg" style={{ color: '#1f1f3d' }}>
              What time did you wake up?
            </Label>
            <div className="relative">
              <input
                type="time"
                id="waketime"
                value={waketime}
                onChange={(e) => setWaketime(e.target.value)}
                className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
              />
              <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
            {!isWithinPrescribedWindow() && (
              <p className="text-sm text-red-500">
                ⚠️ Waketime is outside the prescribed window of {prescribedWaketime}.
              </p>
            )}
          </div>

          {/* Time Out of Bed */}
          <div className="space-y-3">
            <Label htmlFor="time-out-of-bed" className="text-lg" style={{ color: '#1f1f3d' }}>
              What time did you actually get out of bed?
            </Label>
            <div className="relative">
              <input
                type="time"
                id="time-out-of-bed"
                value={timeOutOfBed}
                onChange={(e) => setTimeOutOfBed(e.target.value)}
                className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
              />
              <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Hours Slept - Display Only */}
          <div className="space-y-3">
            <Label className="text-lg" style={{ color: '#1f1f3d' }}>
              Total Sleep Duration
            </Label>
            <div className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Moon className="w-8 h-8 text-purple-600" />
                  <span className="text-5xl text-purple-700">{hoursSlept}</span>
                  <span className="text-2xl text-purple-600">hrs</span>
                </div>
                <p className="text-sm text-gray-600">
                  {hoursSlept < 6
                    ? '⚠️ Less than recommended for most adults'
                    : hoursSlept >= 7 && hoursSlept <= 9
                    ? '✅ Recommended range for adults'
                    : hoursSlept > 9
                    ? 'ℹ️ More than typical for most adults'
                    : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Time to Fall Asleep */}
          <div className="space-y-3">
            <Label htmlFor="time-to-fall-asleep" className="text-lg" style={{ color: '#1f1f3d' }}>
              How long did it take to fall asleep?
            </Label>
            <div className="relative">
              <input
                type="number"
                id="time-to-fall-asleep"
                min="0"
                max="120"
                step="5"
                value={timeToFallAsleep}
                onChange={(e) => setTimeToFallAsleep(parseInt(e.target.value))}
                className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
              />
              <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              {timeToFallAsleep > 30
                ? '⚠️ Longer than recommended for most adults'
                : timeToFallAsleep <= 15
                ? '✅ Recommended range for adults'
                : ''}
            </p>
          </div>

          {/* Night Awakenings */}
          <div className="space-y-3">
            <Label htmlFor="night-awakenings" className="text-lg" style={{ color: '#1f1f3d' }}>
              How many times did you wake up during the night?
            </Label>
            <div className="relative">
              <input
                type="number"
                id="night-awakenings"
                min="0"
                max="10"
                step="1"
                value={nightAwakenings}
                onChange={(e) => setNightAwakenings(parseInt(e.target.value))}
                className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
              />
              <Target className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              {nightAwakenings > 2
                ? '⚠️ More than recommended for most adults'
                : nightAwakenings <= 1
                ? '✅ Recommended range for adults'
                : ''}
            </p>
          </div>

          {/* Time Awake During Night */}
          <div className="space-y-3">
            <Label htmlFor="time-awake-during-night" className="text-lg" style={{ color: '#1f1f3d' }}>
              How long were you awake during the night?
            </Label>
            <div className="relative">
              <input
                type="number"
                id="time-awake-during-night"
                min="0"
                max="120"
                step="5"
                value={timeAwakeDuringNight}
                onChange={(e) => setTimeAwakeDuringNight(parseInt(e.target.value))}
                className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
              />
              <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              {timeAwakeDuringNight > 30
                ? '⚠️ Longer than recommended for most adults'
                : timeAwakeDuringNight <= 15
                ? '✅ Recommended range for adults'
                : ''}
            </p>
          </div>

          {/* Napped Yesterday */}
          <div className="space-y-3">
            <Label className="text-lg" style={{ color: '#1f1f3d' }}>
              Did you nap yesterday?
            </Label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setNappedYesterday(true)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  nappedYesterday
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        nappedYesterday
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      Yes
                    </div>
                  </div>
                  {nappedYesterday && (
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setNappedYesterday(false)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  !nappedYesterday
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        !nappedYesterday
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      No
                    </div>
                  </div>
                  {!nappedYesterday && (
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Nap Minutes */}
          {nappedYesterday && (
            <div className="space-y-3">
              <Label htmlFor="nap-minutes" className="text-lg" style={{ color: '#1f1f3d' }}>
                How long was your nap?
              </Label>
              <div className="relative">
                <input
                  type="number"
                  id="nap-minutes"
                  min="0"
                  max="120"
                  step="5"
                  value={napMinutes}
                  onChange={(e) => setNapMinutes(parseInt(e.target.value))}
                  className="w-full h-10 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base"
                />
                <Clock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Nap Time of Day */}
          {nappedYesterday && (
            <div className="space-y-3">
              <Label className="text-lg" style={{ color: '#1f1f3d' }}>
                When did you nap?
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {['morning', 'afternoon', 'evening'].map((timeOfDay) => (
                  <button
                    key={timeOfDay}
                    type="button"
                    onClick={() => setNapTimeOfDay(timeOfDay)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      napTimeOfDay === timeOfDay
                        ? 'border-teal-500 bg-teal-500 text-white shadow-md'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-teal-300 hover:bg-teal-50/50'
                    }`}
                  >
                    <div className="text-center text-base capitalize">{timeOfDay}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Felt Rested */}
          <div className="space-y-3">
            <Label className="text-lg" style={{ color: '#1f1f3d' }}>
              How rested did you feel?
            </Label>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFeltRested(rating)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    feltRested === rating
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          feltRested === rating
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {rating}
                      </div>
                      <span
                        className={`text-base ${
                          feltRested === rating ? 'text-teal-800 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {restedLabels[rating - 1]}
                      </span>
                    </div>
                    {feltRested === rating && (
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-3">
            <Label className="text-lg" style={{ color: '#1f1f3d' }}>
              Rate your sleep quality (1=poor; 10=great)
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setSleepQuality(rating)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    sleepQuality === rating
                      ? 'border-teal-500 bg-teal-500 text-white shadow-md'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-teal-300 hover:bg-teal-50/50'
                  }`}
                >
                  <div className="text-center text-lg">{rating}</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">
              {sleepQuality <= 3 ? 'Poor quality' : sleepQuality <= 6 ? 'Fair quality' : sleepQuality <= 8 ? 'Good quality' : 'Great quality'}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="sleep-notes" className="text-lg" style={{ color: '#1f1f3d' }}>
              Any notes or observations? (Optional)
            </Label>
            <div className="relative">
              <textarea
                id="sleep-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Woke up once, felt restless, had a dream..."
                className="w-full h-32 p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base resize-none"
              />
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-xl text-base border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 rounded-xl text-base bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              Save Sleep Log
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
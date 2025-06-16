import React from "react";
import { motion } from "framer-motion";
import { X, Lightbulb } from "lucide-react";
import { promptService } from "@/services";

const DailyPromptBanner = ({ onDismiss }) => {
  const dailyPrompt = promptService.getDaily();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-gray-900 mb-2">
                Daily Inspiration
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {dailyPrompt}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center 
                     hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            aria-label="Dismiss daily prompt"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyPromptBanner;
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Comparing Behavioral and Cognitive Learning Approaches",
      subtitle: "Applications in TEFL",
      content: (
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-600">A Critical Analysis for Language Teaching</p>
        </div>
      )
    },
    {
      title: "Overview",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Behavioral Learning</h3>
            <p className="text-gray-700">Learning as observable behavior change through stimulus-response associations</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Cognitive Learning</h3>
            <p className="text-gray-700">Learning as mental process involving understanding, memory, and problem-solving</p>
          </div>
        </div>
      )
    },
    {
      title: "Behavioral Learning Theory",
      subtitle: "Core Principles",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold mb-2">Key Theorists:</p>
            <p className="text-gray-700">Pavlov, Watson, Skinner, Thorndike</p>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Stimulus-Response Conditioning</p>
              <p className="text-sm text-gray-600">Learning occurs through associations between stimuli and responses</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Reinforcement</p>
              <p className="text-sm text-gray-600">Positive/negative reinforcement strengthens desired behaviors</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Repetition & Practice</p>
              <p className="text-sm text-gray-600">Habit formation through repeated drills and exercises</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">Observable Behavior</p>
              <p className="text-sm text-gray-600">Focus on measurable, external behaviors rather than mental processes</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Behaviorism in TEFL",
      subtitle: "Methodological Applications",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3">Audiolingual Method (1950s-1960s)</h4>
            <ul className="space-y-2 text-sm">
              <li>• Pattern drills and mimicry-memorization</li>
              <li>• Error correction and immediate feedback</li>
              <li>• Dialogue repetition and substitution drills</li>
              <li>• Focus on pronunciation and accuracy</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3">Practical Techniques</h4>
            <ul className="space-y-2 text-sm">
              <li>• Choral repetition and drilling</li>
              <li>• Minimal pair practice</li>
              <li>• Substitution tables</li>
              <li>• Positive reinforcement (praise, rewards)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Cognitive Learning Theory",
      subtitle: "Core Principles",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold mb-2">Key Theorists:</p>
            <p className="text-gray-700">Piaget, Vygotsky, Bruner, Ausubel</p>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">Mental Processes</p>
              <p className="text-sm text-gray-600">Learning involves thinking, understanding, and information processing</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">Schema Development</p>
              <p className="text-sm text-gray-600">New knowledge integrates with existing mental frameworks</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">Active Construction</p>
              <p className="text-sm text-gray-600">Learners actively construct meaning rather than passively receiving</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">Metacognition</p>
              <p className="text-sm text-gray-600">Awareness and regulation of one's own learning processes</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Cognitivism in TEFL",
      subtitle: "Methodological Applications",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3">Communicative Language Teaching (CLT)</h4>
            <ul className="space-y-2 text-sm">
              <li>• Focus on meaningful communication</li>
              <li>• Task-based and problem-solving activities</li>
              <li>• Negotiation of meaning</li>
              <li>• Authentic materials and contexts</li>
            </ul>
          </div>
          <div className="bg-green-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3">Practical Techniques</h4>
            <ul className="space-y-2 text-sm">
              <li>• Information gap activities</li>
              <li>• Guided discovery learning</li>
              <li>• Learning strategy training</li>
              <li>• Scaffolding and ZPD application</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Direct Comparison",
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-bold text-blue-700 text-center pb-2 border-b-2 border-blue-500">Behavioral</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">View of Learning</p>
                <p className="text-gray-700">External behavior change</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">Teacher Role</p>
                <p className="text-gray-700">Director, model, reinforcer</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">Learner Role</p>
                <p className="text-gray-700">Passive recipient, imitator</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">Focus</p>
                <p className="text-gray-700">Accuracy, form, habits</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">Error Treatment</p>
                <p className="text-gray-700">Immediate correction</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-green-700 text-center pb-2 border-b-2 border-green-500">Cognitive</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold">View of Learning</p>
                <p className="text-gray-700">Internal mental process</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold">Teacher Role</p>
                <p className="text-gray-700">Facilitator, guide</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold">Learner Role</p>
                <p className="text-gray-700">Active constructor</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold">Focus</p>
                <p className="text-gray-700">Meaning, fluency, strategies</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold">Error Treatment</p>
                <p className="text-gray-700">Learning opportunity</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Strengths: Behavioral Approach",
      content: (
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Clear, Measurable Outcomes</p>
            <p className="text-sm text-gray-700">Easy to assess progress through observable behaviors</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Effective for Basic Skills</p>
            <p className="text-sm text-gray-700">Excellent for pronunciation, vocabulary memorization, grammar patterns</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Structured & Systematic</p>
            <p className="text-sm text-gray-700">Clear progression and organized curriculum</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Habit Formation</p>
            <p className="text-sm text-gray-700">Develops automatic language use through practice</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Immediate Feedback</p>
            <p className="text-sm text-gray-700">Reinforcement helps solidify correct forms</p>
          </div>
        </div>
      )
    },
    {
      title: "Limitations: Behavioral Approach",
      content: (
        <div className="space-y-3">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Ignores Mental Processes</p>
            <p className="text-sm text-gray-700">Doesn't account for understanding, creativity, or problem-solving</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Limited Communicative Competence</p>
            <p className="text-sm text-gray-700">Students may drill perfectly but struggle in real communication</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Passive Learning</p>
            <p className="text-sm text-gray-700">Reduces learner autonomy and intrinsic motivation</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Mechanical & Repetitive</p>
            <p className="text-sm text-gray-700">Can be demotivating and doesn't engage critical thinking</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Doesn't Address Individual Differences</p>
            <p className="text-sm text-gray-700">One-size-fits-all approach ignores learning styles and cognitive strategies</p>
          </div>
        </div>
      )
    },
    {
      title: "Strengths: Cognitive Approach",
      content: (
        <div className="space-y-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Develops True Competence</p>
            <p className="text-sm text-gray-700">Focuses on understanding and meaningful use</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Promotes Autonomy</p>
            <p className="text-sm text-gray-700">Learners develop strategies for independent learning</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Transfer of Learning</p>
            <p className="text-sm text-gray-700">Skills and strategies applicable to new contexts</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Intrinsic Motivation</p>
            <p className="text-sm text-gray-700">Engaging, meaningful tasks increase learner investment</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">✓ Addresses Individual Differences</p>
            <p className="text-sm text-gray-700">Accommodates diverse learning styles and strategies</p>
          </div>
        </div>
      )
    },
    {
      title: "Limitations: Cognitive Approach",
      content: (
        <div className="space-y-3">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Less Structured</p>
            <p className="text-sm text-gray-700">Can be overwhelming for beginners or those who prefer clear guidance</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Difficult to Assess</p>
            <p className="text-sm text-gray-700">Mental processes and understanding harder to measure than behavior</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ May Neglect Accuracy</p>
            <p className="text-sm text-gray-700">Focus on fluency can lead to fossilized errors</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Requires More Preparation</p>
            <p className="text-sm text-gray-700">Authentic materials and tasks demand more teacher planning</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <p className="font-semibold mb-2">✗ Cultural Considerations</p>
            <p className="text-sm text-gray-700">Active, student-centered learning may not fit all educational cultures</p>
          </div>
        </div>
      )
    },
    {
      title: "Impact on Second Language Acquisition",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3">Behavioral Perspective</h4>
            <p className="text-sm text-gray-700 mb-2">Language acquisition as habit formation</p>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• L1 interference (negative transfer)</li>
              <li>• Contrastive analysis hypothesis</li>
              <li>• Errors as habits to be prevented</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3">Cognitive Perspective</h4>
            <p className="text-sm text-gray-700 mb-2">Language acquisition as creative mental process</p>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Interlanguage development</li>
              <li>• Error analysis (systematic, developmental errors)</li>
              <li>• Noticing hypothesis and consciousness-raising</li>
              <li>• Input processing and interaction hypothesis</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Contemporary TEFL: Integration",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-lg">
            <h4 className="font-bold mb-3 text-center">Modern Approach: Eclecticism</h4>
            <p className="text-sm text-gray-700 text-center mb-4">
              Most effective TEFL practitioners draw from both paradigms
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded">
              <p className="font-semibold mb-2">Behavioral Elements</p>
              <p className="text-gray-700">Pronunciation drills, vocabulary flashcards, grammar exercises, error correction</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="font-semibold mb-2">Cognitive Elements</p>
              <p className="text-gray-700">Communicative tasks, problem-solving, authentic materials, learner strategies</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg mt-4">
            <p className="font-semibold mb-2">Principled Eclecticism:</p>
            <p className="text-sm text-gray-700">Choose methods based on learning objectives, proficiency level, learner needs, and context rather than ideological commitment</p>
          </div>
        </div>
      )
    },
    {
      title: "Practical Examples in the Classroom",
      content: (
        <div className="space-y-4 text-sm">
          <div className="border-2 border-blue-200 p-4 rounded-lg">
            <p className="font-bold text-blue-700 mb-2">Behavioral Activity: Grammar Drill</p>
            <p className="text-gray-700 mb-2">Teacher provides pattern, students substitute elements:</p>
            <p className="bg-gray-100 p-2 rounded italic">T: "I went to the store." → S: "He went to the store." → "She went to the store."</p>
            <p className="text-gray-600 mt-2">Purpose: Automaticity through repetition</p>
          </div>
          <div className="border-2 border-green-200 p-4 rounded-lg">
            <p className="font-bold text-green-700 mb-2">Cognitive Activity: Information Gap</p>
            <p className="text-gray-700 mb-2">Students work in pairs with different information, must communicate to complete a map/schedule/story</p>
            <p className="text-gray-600 mt-2">Purpose: Meaningful communication and problem-solving</p>
          </div>
          <div className="border-2 border-purple-200 p-4 rounded-lg">
            <p className="font-bold text-purple-700 mb-2">Integrated Activity: Task-Based Learning</p>
            <p className="text-gray-700 mb-2">Plan a trip (cognitive task) → followed by focused practice on past tense forms that emerged (behavioral practice)</p>
            <p className="text-gray-600 mt-2">Purpose: Meaningful use followed by form-focused practice</p>
          </div>
        </div>
      )
    },
    {
      title: "Critical Considerations for TEFL",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Context Matters</p>
            <p className="text-sm text-gray-700">EFL vs ESL, age groups, educational culture, class size, resources</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Proficiency Level</p>
            <p className="text-sm text-gray-700">Beginners may benefit more from structured behavioral approaches; advanced learners from cognitive strategies</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Learning Objectives</p>
            <p className="text-sm text-gray-700">Accuracy vs fluency, form vs function, discrete skills vs integrated competence</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Learner Variables</p>
            <p className="text-sm text-gray-700">Motivation, learning styles, educational background, cultural expectations</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Balance</p>
            <p className="text-sm text-gray-700">Neither approach is universally superior; effectiveness depends on judicious application</p>
          </div>
        </div>
      )
    },
    {
      title: "Conclusion",
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">Both paradigms have shaped modern TEFL</p>
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Behavioral approaches contribute structure, practice, and habit formation
              </p>
              <p className="text-gray-700 mb-4">
                Cognitive approaches contribute meaning, understanding, and learner autonomy
              </p>
              <p className="font-semibold text-lg text-gray-800">
                Effective language teaching requires thoughtful integration of both perspectives
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "References & Further Reading",
      content: (
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-lg mb-4">Key Sources:</p>
          <div className="space-y-2 text-gray-700">
            <p>• Brown, H.D. (2007). <em>Principles of Language Learning and Teaching</em></p>
            <p>• Larsen-Freeman, D. (2000). <em>Techniques and Principles in Language Teaching</em></p>
            <p>• Lightbown, P.M. & Spada, N. (2013). <em>How Languages are Learned</em></p>
            <p>• Richards, J.C. & Rodgers, T.S. (2014). <em>Approaches and Methods in Language Teaching</em></p>
            <p>• Ellis, R. (2015). <em>Understanding Second Language Acquisition</em></p>
            <p>• Nunan, D. (2004). <em>Task-Based Language Teaching</em></p>
            <p>• Long, M.H. & Doughty, C.J. (2009). <em>The Handbook of Language Teaching</em></p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Slide Content */}
          <div className="p-12 min-h-[600px] flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {slides[currentSlide].title}
              </h1>
              {slides[currentSlide].subtitle && (
                <h2 className="text-2xl text-gray-600">
                  {slides[currentSlide].subtitle}
                </h2>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-100 px-8 py-4 flex items-center justify-between border-t">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="bg-gray-50 px-8 py-2 text-center text-sm text-gray-600 border-t">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
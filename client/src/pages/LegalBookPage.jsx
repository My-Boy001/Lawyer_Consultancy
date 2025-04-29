import React, { useState } from 'react';
import { Search, Book, BookOpen, BookText, Bookmark, ChevronDown, ChevronRight } from 'lucide-react';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';

const LegalBookPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openAccordions, setOpenAccordions] = useState([0]);

  // Toggle accordion open/closed
  const toggleAccordion = (index) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter(item => item !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };

  // Categories for the sidebar
  const categories = [
    { id: 'all', name: 'All Resources', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'family', name: 'Family Law', icon: <BookText className="h-5 w-5" /> },
    { id: 'business', name: 'Business Law', icon: <BookText className="h-5 w-5" /> },
    { id: 'criminal', name: 'Criminal Law', icon: <BookText className="h-5 w-5" /> },
    { id: 'estate', name: 'Estate Planning', icon: <BookText className="h-5 w-5" /> },
    { id: 'immigration', name: 'Immigration', icon: <BookText className="h-5 w-5" /> },
  ];

  // Mock legal resources data
  const legalResources = [
    {
      id: 1,
      category: 'family',
      title: 'Child Custody Laws',
      content: `
        <p>Child custody determinations are made based on the best interests of the child. Courts consider several factors when making these determinations, including:</p>
        <ul>
          <li>The child's relationship with each parent</li>
          <li>Each parent's ability to provide for the child's needs</li>
          <li>The child's adjustment to home, school, and community</li>
          <li>The mental and physical health of all parties involved</li>
          <li>Any history of domestic violence or abuse</li>
        </ul>
        <p>There are two main types of custody:</p>
        <p><strong>Physical custody</strong>: Where the child lives.</p>
        <p><strong>Legal custody</strong>: The right to make important decisions about the child's upbringing, such as education, healthcare, and religious instruction.</p>
        <p>Both types can be awarded solely to one parent or jointly to both parents, depending on the circumstances.</p>
      `
    },
    {
      id: 2,
      category: 'family',
      title: 'Divorce Proceedings',
      content: `
        <p>Divorce is the legal dissolution of a marriage. The process typically involves several steps:</p>
        <ol>
          <li><strong>Filing a petition</strong>: One spouse files a petition with the court.</li>
          <li><strong>Temporary orders</strong>: The court may issue temporary orders regarding child custody, support, and use of property while the divorce is pending.</li>
          <li><strong>Discovery</strong>: Both parties exchange information about their finances and other relevant matters.</li>
          <li><strong>Negotiation</strong>: The parties attempt to reach a settlement on issues such as property division, support, and custody.</li>
          <li><strong>Trial</strong>: If a settlement can't be reached, the case goes to trial where a judge makes the final decisions.</li>
          <li><strong>Judgment</strong>: The court issues a final decree of divorce.</li>
        </ol>
        <p>Most states have "no-fault" divorce laws, which mean that a divorce can be granted without proving that one spouse did something wrong.</p>
      `
    },
    {
      id: 3,
      category: 'business',
      title: 'Business Entity Formation',
      content: `
        <p>Choosing the right business entity is crucial for legal and tax purposes. Common business entities include:</p>
        <ul>
          <li><strong>Sole Proprietorship</strong>: A business owned by one person with no legal distinction between the owner and the business.</li>
          <li><strong>Partnership</strong>: A business owned by two or more people who share responsibilities and profits.</li>
          <li><strong>Limited Liability Company (LLC)</strong>: A hybrid entity that provides the limited liability features of a corporation with the tax efficiencies and operational flexibility of a partnership.</li>
          <li><strong>Corporation</strong>: A legal entity separate from its owners, which can shield owners from personal liability.</li>
        </ul>
        <p>Factors to consider when choosing a business entity include:</p>
        <ul>
          <li>Liability protection</li>
          <li>Tax implications</li>
          <li>Management structure</li>
          <li>Costs and paperwork</li>
          <li>Ability to raise capital</li>
        </ul>
      `
    },
    {
      id: 4,
      category: 'criminal',
      title: 'Criminal Defense Basics',
      content: `
        <p>If you're accused of a crime, you have specific rights protected by the U.S. Constitution, including:</p>
        <ul>
          <li>The right to remain silent (Fifth Amendment)</li>
          <li>The right to an attorney (Sixth Amendment)</li>
          <li>The right to a fair and speedy trial (Sixth Amendment)</li>
          <li>Protection against unreasonable searches and seizures (Fourth Amendment)</li>
        </ul>
        <p>The criminal justice process typically includes these stages:</p>
        <ol>
          <li><strong>Investigation</strong>: Law enforcement gathers evidence.</li>
          <li><strong>Arrest</strong>: Based on probable cause that a crime was committed.</li>
          <li><strong>Booking</strong>: Administrative procedure following an arrest.</li>
          <li><strong>Initial appearance/arraignment</strong>: Formal reading of charges in court.</li>
          <li><strong>Pretrial</strong>: Period of preparation before trial.</li>
          <li><strong>Trial</strong>: Determination of guilt or innocence.</li>
          <li><strong>Sentencing</strong>: If found guilty, punishment is determined.</li>
          <li><strong>Appeal</strong>: Request for a higher court to review the case.</li>
        </ol>
      `
    },
    {
      id: 5,
      category: 'estate',
      title: 'Estate Planning Essentials',
      content: `
        <p>Estate planning is the process of arranging for the management and disposal of your estate during your life and after death. Key estate planning documents include:</p>
        <ul>
          <li><strong>Will</strong>: A legal document that expresses your wishes regarding the distribution of your property and the care of any minor children.</li>
          <li><strong>Trust</strong>: A legal arrangement in which assets are held by one party for the benefit of another.</li>
          <li><strong>Power of Attorney</strong>: A legal document giving someone else the authority to act on your behalf in specified matters.</li>
          <li><strong>Healthcare Directive</strong>: Instructions specifying what actions should be taken regarding your health if you are no longer able to make decisions due to illness or incapacity.</li>
        </ul>
        <p>Benefits of estate planning include:</p>
        <ul>
          <li>Ensuring your wishes are carried out</li>
          <li>Minimizing taxes and expenses</li>
          <li>Avoiding probate</li>
          <li>Protecting beneficiaries</li>
          <li>Planning for incapacity</li>
        </ul>
      `
    },
    {
      id: 6,
      category: 'immigration',
      title: 'Immigration Law Overview',
      content: `
        <p>Immigration law refers to the national statutes, regulations, and legal precedents governing immigration into and deportation from a country. In the United States, common immigration pathways include:</p>
        <ul>
          <li><strong>Family-Based Immigration</strong>: U.S. citizens and permanent residents can petition for certain family members.</li>
          <li><strong>Employment-Based Immigration</strong>: For those with job offers or specific skills needed in the U.S.</li>
          <li><strong>Refugee or Asylum Status</strong>: For those fleeing persecution in their home countries.</li>
          <li><strong>Diversity Visa Lottery</strong>: A program that provides visas to individuals from countries with historically low rates of immigration to the United States.</li>
          <li><strong>Temporary Visas</strong>: For tourists, students, temporary workers, or business visitors.</li>
        </ul>
        <p>Important immigration documents include:</p>
        <ul>
          <li>Green Card (Permanent Resident Card)</li>
          <li>Employment Authorization Document (Work Permit)</li>
          <li>Visa (Immigrant or Non-immigrant)</li>
          <li>Certificate of Naturalization</li>
          <li>Certificate of Citizenship</li>
        </ul>
      `
    }
  ];

  // Filter resources based on active category and search query
  const filteredResources = legalResources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-blue-800 py-20 px-4">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Resource Library</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Access comprehensive legal information and guides to help you understand your rights and legal options.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search for legal topics, keywords, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="primary"
                className="absolute right-2.5 bottom-2.5"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card>
                <CardBody>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Book className="h-5 w-5 mr-2 text-blue-800" />
                    Legal Topics
                  </h2>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
                          activeCategory === category.id 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span className="mr-2 text-blue-800">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="mt-6">
                <CardBody>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Bookmark className="h-5 w-5 mr-2 text-blue-800" />
                    Legal Help
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Need personalized legal advice for your specific situation?
                  </p>
                  <Button
                    variant="primary"
                    fullWidth
                  >
                    Schedule a Consultation
                  </Button>
                </CardBody>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <h2 className="text-2xl font-bold mb-6">
                {activeCategory === 'all' ? 'All Legal Resources' : categories.find(c => c.id === activeCategory)?.name}
              </h2>

              {filteredResources.length > 0 ? (
                <div className="space-y-6">
                  {filteredResources.map((resource, index) => (
                    <Card key={resource.id}>
                      <CardBody>
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleAccordion(index)}
                        >
                          <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                          <div className="text-blue-800">
                            {openAccordions.includes(index) ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                        
                        {openAccordions.includes(index) && (
                          <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: resource.content }}>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    We couldn't find any resources matching your search. 
                    Please try different keywords or browse our categories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Legal AI Assistant</h2>
            <p className="text-gray-600 mb-8">
              Our AI can provide general information on common legal topics. 
              Note that AI responses are for informational purposes only and do not constitute legal advice.
            </p>
            
            <Card>
              <CardBody>
                <div className="mb-4">
                  <label htmlFor="ai-query" className="block text-sm font-medium text-gray-700 mb-1">
                    Ask a Legal Question
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="ai-query"
                      className="w-full p-4 pl-4 pr-12 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g., What is the difference between a will and a trust?"
                    />
                    <Button
                      variant="primary"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      Ask
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm italic">
                    AI responses will appear here. For personalized legal advice, please schedule a consultation with one of our attorneys.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Legal Advice?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Our experienced attorneys can provide guidance tailored to your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
            >
              Schedule a Consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white/10"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalBookPage;